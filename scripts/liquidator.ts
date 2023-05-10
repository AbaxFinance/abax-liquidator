import { getContractObject, replaceRNBNPropsWithStrings } from '@abaxfinance/contract-helpers';
import { E18bn, E6bn, E8, ReturnPromiseType, convertFromCurrencyDecimalsStatic, fromE6, getArgvObj } from '@abaxfinance/utils';
import Keyring from '@polkadot/keyring';
import BN from 'bn.js';
import ccxt from 'ccxt';
import chalk from 'chalk';
import LendingPool from 'typechain/contracts/lending_pool';
import PSP22Ownable from 'typechain/contracts/psp22_ownable';
import { BorrowVariable } from 'typechain/event-types/lending_pool';
import { AccountId, AssetRules, ReserveData, UserConfig, UserReserveData } from 'typechain/types-returns/lending_pool';
import { measureTime } from './benchmarking/utils';
import { apiProviderWrapper, sleep } from './common';
import { EventWithMeta, getPreviousEvents } from './fetchEvents';

const LENDING_POOL_ADDRESS = '5C9MoPeD8rEATyW77U6fmUcnzGpvoLvqQ9QTMiA9oByGwffx';

const RESERVE_ADDRESSES_BY_NAME = {
  USDC_TEST: '5G8Jpgj7dZoP5wuMgTHdBPUWTmZaYaEyvaYurJpgVb1ki3ky',
  WETH_TEST: '5CVxZjK7WQCcjmgGZA35pTqyXr1cvvEe22nrz6wSTcsW1nTv',
  BTC_TEST: '5GRu3YzEN9YBrcB9EaqiGpKpjwW9HmuwSAbDdeCw4v69sn6C',
  AZERO_TEST: '5DRWtNpAKukhyTHzEfkk7PjLQZq9E7CcArc8bGkLx9AE3Z5p',
  DOT_TEST: '5ELWMYwQSgmKLYJhu5WigEZA5t6Y7QZ8w4dzeFkawU436LJ9',
} as const;

const MARKET_SYMBOLS_BY_RESERVE_NAME = {
  AZERO_TEST: 'AZERO/USDT',
  BTC_TEST: 'BTC/USDT',
  USDC_TEST: 'USDC/USDT',
  WETH_TEST: 'ETH/USDT',
  DOT_TEST: 'DOT/USDT',
} as const;
type RESERVE_NAMES_TYPE = keyof typeof MARKET_SYMBOLS_BY_RESERVE_NAME;
type MarketRule = (AssetRules | null)[];
const RESERVE_NAMES = Object.keys(RESERVE_ADDRESSES_BY_NAME) as (keyof typeof RESERVE_ADDRESSES_BY_NAME)[];

const getReserveName = (addr: string) =>
  Object.entries(RESERVE_ADDRESSES_BY_NAME).find(([_, address]) => addr === address)?.[0] as RESERVE_NAMES_TYPE | undefined;
const keyring = new Keyring();
(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const seed = process.env.SEED;
  if (!seed) throw 'could not determine seed';
  const api = await apiProviderWrapper.getAndWaitForReady();

  const liquidationSignerSpender = keyring.createFromUri(seed, {}, 'sr25519');
  const lendingPool = await getContractObject(LendingPool, LENDING_POOL_ADDRESS, liquidationSignerSpender, api);

  const eventLog: EventWithMeta[] = getPreviousEvents(lendingPool.abi.info.contract.name.toString());

  console.log(new Date(), 'event count', eventLog.length);
  const borrowEvents = eventLog.filter((e) => e.meta.eventName === 'BorrowVariable');

  const uniqueAddresses = Array.from(
    borrowEvents.map((be) => (be.event as BorrowVariable).onBehalfOf.toString()).reduce((set, e) => set.add(e), new Set<string>()),
  );

  console.log(new Date(), 'unique addresses', uniqueAddresses.length);

  const usingContractAPI = 'USING_CONTRACT_API';
  const usingContractAPITimeRes = await measureTime(1, usingContractAPI, async () => {
    const reserveDatas = await fetchProtocolReserveDatas(lendingPool);
    const kucoinExchange = new ccxt.kucoin();
    console.log('Loading markets....');
    await kucoinExchange.loadMarkets();
    console.log('Markets loaded...');

    console.log('Load prices...');

    const priceMap = new Map<RESERVE_NAMES_TYPE, number>();
    for (const [reserveName, marketPair] of Object.entries(MARKET_SYMBOLS_BY_RESERVE_NAME)) {
      let orderbook: ReturnPromiseType<typeof kucoinExchange.fetchOrderBook>;
      try {
        orderbook = await kucoinExchange.fetchOrderBook(marketPair);
      } catch (e) {
        console.error('Error during fetchOrderBook', e);
        await sleep(1 * 60 * 1000);
        continue;
      }
      const price = orderbook.bids[0][0];
      priceMap.set(reserveName as RESERVE_NAMES_TYPE, price);
    }
    console.log('Prices loaded...');
    const usersWithReserveDatas = (await Promise.all(uniqueAddresses.slice(0, 20).map((ua) => getUserReserveDatas(lendingPool, ua)))).filter(
      (ud) => ud.userConfig && ud.userReserveDatas,
    ) as { userAddress: string; userReserveDatas: [AccountId, UserReserveData][]; userConfig: UserConfig }[];

    const marketRules = new Map<string, MarketRule>();
    for (const user of usersWithReserveDatas) {
      if (!marketRules.has(user.userConfig.marketRuleId.toString())) {
        console.log(`fetching market rule.... ${user.userConfig.marketRuleId}`);
        const {
          value: { ok: marketRule },
        } = await lendingPool.query.viewMarketRule(user.userConfig?.marketRuleId);
        marketRules.set(user.userConfig.marketRuleId.toString(), marketRule!);
      }

      const userReserveDatasByName = user.userReserveDatas.reduce((acc, currVal) => {
        const reserveName = getReserveName(currVal[0].toString());
        if (reserveName) acc[reserveName] = currVal[1];
        return acc;
      }, {} as Record<RESERVE_NAMES_TYPE, UserReserveData>);

      const userChosenMarketRule = marketRules.get(user.userConfig.marketRuleId.toString())!;
      const { collateralPower, biggestCollateralData } = calculateCollateralPower(
        user.userConfig,
        reserveDatas,
        userReserveDatasByName,
        userChosenMarketRule,
        priceMap,
      );
      const { debtPower, biggestLoanData } = calculateDebtPower(reserveDatas, userReserveDatasByName, userChosenMarketRule, priceMap);

      if (collateralPower < debtPower) {
        //try to liquidate
        // console.log(new Date(), 'try to liquidate', { user });

        //TODO liquidate using flashloan, calculate minimum token received to be profitable against flashloan costs
        const minimumTokenReceivedE18 = calculateMinimumTokenReceivedE18(
          biggestLoanData,
          biggestCollateralData,
          reserveDatas,
          priceMap,
          userChosenMarketRule,
        );

        const reserveTokenToRepay = await getContractObject(
          PSP22Ownable,
          biggestLoanData.underlyingAddress.toString(),
          liquidationSignerSpender,
          api,
        );
        await reserveTokenToRepay.tx.approve(lendingPool.address, biggestLoanData.amountRaw.muln(2));

        const queryRes = await lendingPool
          .withSigner(liquidationSignerSpender)
          .query.liquidate(
            user.userAddress,
            biggestLoanData.underlyingAddress,
            biggestCollateralData.underlyingAddress,
            null,
            minimumTokenReceivedE18,
            [],
          );

        try {
          queryRes.value.unwrapRecursively();
          console.log(new Date(), 'Succesfully liquidated');
        } catch (e) {
          console.error(new Date(), 'liquidation unsuccessfull', e);
        }
        console.table([
          ...Object.entries({
            userAddress: user.userAddress,
            loanUnderlyingAddress: biggestLoanData.underlyingAddress,
            collateralUnderlyingAddress: biggestCollateralData.underlyingAddress,
            minimumTokenReceivedE18: minimumTokenReceivedE18.toString(),
          }),
          ...Object.entries(replaceRNBNPropsWithStrings(biggestCollateralData)).map(([k, v]) => [`biggestCollateralData__${k}`, v]),
          ...Object.entries(replaceRNBNPropsWithStrings(biggestLoanData)).map(([k, v]) => [`biggestLoanData__${k}`, v]),
        ]);
      }
    }
  });

  console.table([usingContractAPITimeRes]);

  await api.disconnect();
  process.exit(0);
})(getArgvObj()).catch((e) => {
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});

function calculateMinimumTokenReceivedE18(
  loanData: {
    amountInHuman: number;
    amountRaw: BN;
    symbol: RESERVE_NAMES_TYPE;
    underlyingAddress: string;
    decimalDenominator: BN;
  },
  collateralData: {
    amountRaw: BN;
    amountInHuman: number;
    symbol: RESERVE_NAMES_TYPE;
    underlyingAddress: string;
    decimalDenominator: BN;
  },
  reserveDatas: Record<RESERVE_NAMES_TYPE, ReserveData & { underlyingAddress: AccountId }>,
  prices: Map<RESERVE_NAMES_TYPE, number>,
  userChosenMarketRule: MarketRule,
) {
  const assetToRepayPriceE8 = new BN((prices.get(loanData.symbol)! * E8).toString());
  const assetToTakePriceE8 = new BN((prices.get(collateralData.symbol)! * E8).toString());
  const reserveDataToRepay = reserveDatas[loanData.symbol];
  const reserveDataToTake = reserveDatas[collateralData.symbol];
  const penaltyToRepayE6 = userChosenMarketRule[reserveDataToRepay.id]!.penaltyE6!.rawNumber!;
  const penaltyToTakeE6 = userChosenMarketRule[reserveDataToTake.id]!.penaltyE6!.rawNumber!;
  const amountToRepay = loanData.amountRaw;

  let amountToTake = amountToRepay
    .mul(assetToRepayPriceE8.mul(reserveDataToTake.decimals.rawNumber).mul(E6bn.add(penaltyToRepayE6).add(penaltyToTakeE6)))
    .div(assetToTakePriceE8.mul(reserveDataToRepay.decimals.rawNumber).mul(E6bn));

  if (amountToTake.gt(collateralData.amountRaw)) {
    amountToTake = collateralData.amountRaw;
  }
  const receivedForOneRepaidTokenE18 = amountToTake.mul(E18bn).div(amountToRepay);

  return receivedForOneRepaidTokenE18.muln(0.95);

  // const penaltyMultiplier = new BN(E6).add(penaltyToRepayE6).add(penaltyToTakeE6);
  // const receivedForOneRepaidToken =
  //   reserveDataToTake.decimals.rawNumber
  //     .muln(assetToRepayPrice)
  //     .mul(penaltyMultiplier)
  //     .div(reserveDataToRepay.decimals.rawNumber)
  //     .divn(E6)
  //     .toNumber() / assetToTakePrice;

  // const amountToRepay = loanData.amountRaw.muln(receivedForOneRepaidToken).gte(collateralData.amountRaw)
  //   ? loanData.amountRaw.muln(receivedForOneRepaidToken)
  //   : collateralData.amountRaw;

  // return amountToRepay.mul(E18bn).div(loanData.amountRaw);
}

async function fetchProtocolReserveDatas(lendingPool: LendingPool) {
  const reserveDatasRetVal = (await lendingPool.query.viewReserveDatas(null)).value.unwrapRecursively();
  const reserveDatas = reserveDatasRetVal.reduce((acc, [reserveAddress, reserve]) => {
    //
    if (!reserve) return acc;
    const reserveName = getReserveName(reserveAddress.toString());
    if (reserveName) acc[reserveName] = { ...reserve, underlyingAddress: reserveAddress };
    return acc;
  }, {} as Record<RESERVE_NAMES_TYPE, ReserveData & { underlyingAddress: AccountId }>);
  return reserveDatas;
}

export const getIsUsedAsCollateral = (userConfig: UserConfig, reserve: ReserveData) => {
  return ((userConfig.collaterals.toNumber() >> reserve.id) & 1) === 1;
};

const calculateCollateralPower = (
  userConfig: UserConfig,
  reserveDatas: Record<RESERVE_NAMES_TYPE, ReserveData & { underlyingAddress: AccountId }>,
  userReserveDatas: Record<RESERVE_NAMES_TYPE, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
  prices: Map<RESERVE_NAMES_TYPE, number>,
) => {
  let collateralPower = 0;
  const biggestCollateralData: {
    amountRaw: BN;
    amountInHuman: number;
    symbol: RESERVE_NAMES_TYPE;
    underlyingAddress: string;
    decimalDenominator: BN;
  } = {
    amountInHuman: 0,
    symbol: 'AZERO_TEST',
    underlyingAddress: '',
    decimalDenominator: new BN(0),
    amountRaw: new BN(0),
  };
  const reservesWithCollaterals = RESERVE_NAMES.map((symbol) => {
    const reserveData = reserveDatas[symbol];
    if (!getIsUsedAsCollateral(userConfig, reserveData)) return { symbol, collateral: 0 };
    const assetRule = marketRule[reserveData.id];
    const supplyInHuman = convertFromCurrencyDecimalsStatic(symbol, userReserveDatas[symbol].supplied.rawNumber);
    const priceInHuman = prices.get(symbol)!;
    const collateralCoefficientInHuman = assetRule && assetRule.collateralCoefficientE6 ? fromE6(assetRule.collateralCoefficientE6.rawNumber) : 0;
    const reserveCollateral = supplyInHuman * priceInHuman * collateralCoefficientInHuman;
    if (biggestCollateralData.amountInHuman < reserveCollateral) {
      biggestCollateralData.amountInHuman = reserveCollateral;
      biggestCollateralData.amountRaw = userReserveDatas[symbol].supplied.rawNumber;
      biggestCollateralData.symbol = symbol;
      biggestCollateralData.underlyingAddress = reserveData.underlyingAddress.toString();
      biggestCollateralData.decimalDenominator = reserveData.decimals.rawNumber;
    }
    collateralPower += reserveCollateral;
    return { symbol, collateral: reserveCollateral };
  });

  return { collateralPower, reservesWithCollaterals, biggestCollateralData };
};
const calculateDebtPower = (
  reserveDatas: Record<RESERVE_NAMES_TYPE, ReserveData & { underlyingAddress: AccountId }>,
  userReserveDatas: Record<RESERVE_NAMES_TYPE, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
  prices: Map<RESERVE_NAMES_TYPE, number>,
) => {
  let debtPower = 0;
  const biggestLoanData: {
    amountRaw: BN;
    amountInHuman: number;
    symbol: RESERVE_NAMES_TYPE;
    underlyingAddress: string;
    decimalDenominator: BN;
  } = {
    amountInHuman: 0,
    symbol: 'AZERO_TEST',
    underlyingAddress: '',
    decimalDenominator: new BN(0),
    amountRaw: new BN(0),
  };
  const reserveWithDebts = RESERVE_NAMES.map((symbol) => {
    const reserveData = reserveDatas[symbol];
    const userReserveData = userReserveDatas[symbol];
    const assetRule = marketRule[reserveData.id];
    const debtInHuman = convertFromCurrencyDecimalsStatic(symbol, userReserveData.debt.rawNumber);
    const priceInHuman = prices.get(symbol)!;
    const borrowCoefficientInHuman = assetRule && assetRule.borrowCoefficientE6 !== null ? fromE6(assetRule.borrowCoefficientE6.rawNumber) : 0;
    const reserveDebt = debtInHuman * priceInHuman * borrowCoefficientInHuman;
    if (biggestLoanData.amountInHuman < reserveDebt) {
      biggestLoanData.amountInHuman = reserveDebt;
      biggestLoanData.amountRaw = userReserveData.debt.rawNumber;
      biggestLoanData.symbol = symbol;
      biggestLoanData.underlyingAddress = reserveData.underlyingAddress.toString();
      biggestLoanData.decimalDenominator = reserveData.decimals.rawNumber;
    }
    debtPower += reserveDebt;
    return { symbol, debt: reserveDebt };
  });

  return { debtPower, reserveWithDebts, biggestLoanData };
};

async function getUserReserveDatas(
  lendingPool: LendingPool,
  userAddress: string,
  retriesLeft: number = 5,
): Promise<{ userAddress: string; userReserveDatas: [AccountId, UserReserveData][] | null; userConfig: UserConfig | null }> {
  try {
    const {
      value: { ok: userReserveDatas, err: errUserReserveData },
    } = await lendingPool.query.viewUserReserveDatas(null, userAddress);
    const {
      value: { ok: userConfig, err: errConfig },
    } = await lendingPool.query.viewUserConfig(userAddress);
    if (!userReserveDatas) {
      console.error(new Date(), `user ${userAddress} viewUserReserveDatas fetch error`, errUserReserveData);
      return { userAddress, userReserveDatas: null, userConfig: null };
    }
    if (!userConfig) {
      console.error(new Date(), `user ${userAddress} viewUserConfig fetch error`, errConfig);
      return { userAddress, userReserveDatas: null, userConfig: null };
    }
    return { userAddress, userReserveDatas, userConfig };
  } catch (e: any) {
    if (
      retriesLeft > 0 &&
      (e.message.toLowerCase().includes('websocket is not connected') || e.message.toLowerCase().includes('disconnected from wss'))
    ) {
      console.warn(e.message, 'retrying...');
      const freshApi = await apiProviderWrapper.getAndWaitForReady(false);
      return getUserReserveDatas(lendingPool.withAPI(freshApi), userAddress);
    }
    console.error(e);
    return { userAddress, userReserveDatas: null, userConfig: null };
  }
}
