import {
  AToken,
  BalanceViewer,
  LendingPool,
  Psp22Ownable,
  VToken,
  getContractObject,
  type UserConfig,
  type UserReserveData,
  type MarketRule,
  PriceFeedProvider,
} from 'wookashwackomytest-contract-helpers';
import {
  SUPPORTED_CURRENCIES_DECIMALS,
  convertNumberOrStringToBN,
  getArgvObj,
  type SUPPORTED_CURRENCIES_TYPE,
  SUPPORTED_CURRENCIES_SYMBOLS,
} from 'wookashwackomytest-utils';
import { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import { nobody } from '@polkadot/keyring/pair/nobody';
import type { KeyringPair } from '@polkadot/keyring/types';
import { apiProviderWrapper } from '@scripts/common';
import { supplyNativeTAZEROBalance } from '@scripts/fundWalletWithTestTokens';
import { getStoredUsers } from '@scripts/supplyAndBorrow1000Users';
import { queryProtocolReserveDatas } from '@src/common/chain-data-utils';
import { deployedContractsGetters } from '@src/deployedContracts';
import type { ReserveDataWithMetadata } from '@src/types';
import { BALANCE_VIEWER_ADDRESS, LENDING_POOL_ADDRESS, getIsUsedAsCollateral } from '@src/utils';
import BN from 'bn.js';
import chalk from 'chalk';
import PQueue from 'p-queue';
import { ChainDataFetchStrategy } from '@src/hf-recalculation/ChainDataFetchStrategy';
import { E18bn, E6bn } from '@c-forge/polkahat-network-helpers';

const toE6 = (n: number) => n * 1_000_000;

const forbiddenRegexps = [
  /Unable to find handler for subscription/,
  /Unable to find active subscription/,
  /has multiple versions, ensure that there is only one installed/,
  /Either remove and explicitly install matching versions or dedupe using your package manager/,
  /The following conflicting packages were found/,
  /cjs \d[.]\d[.]\d/,
  /API-WS: disconnected from ws/,
  /RPC methods not decorated: timestamp_setTime/,
  /disconnected from ws:\/\/127.0.0.1:9944: 1000:: Normal connection closure/,
  /Invalid AccountId provided, expected 32 bytes, found 18/, // event decoding fails and that is an artifact of it
  /Unable to map \[u8; 32\] to a lookup index/,
];

function shouldSkipConsoleLog(args: IArguments) {
  return [...args].some((a) => forbiddenRegexps.some((reg) => (a.toString() as string).match(reg)));
}

if (console) {
  for (const c in console) {
    if (typeof console[c] === 'function') {
      const cx = console[c];
      console[c] = function () {
        // eslint-disable-next-line prefer-rest-params
        const shouldSkip = shouldSkipConsoleLog(arguments);
        if (shouldSkip) return;
        // eslint-disable-next-line prefer-rest-params
        cx.apply(this, arguments);
      };
    }
  }
}

const keyring = new Keyring();
const queue = new PQueue({ concurrency: 5, autoStart: false });

(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const api = await apiProviderWrapper.getAndWaitForReady();

  const seed = process.env.SEED;
  if (!seed) throw 'could not determine seed';

  const signerWithFunds = keyring.createFromUri(seed, {}, 'sr25519');

  const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signerWithFunds, api);

  const balanceViewer = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, nobody(), api);

  const reserveContractInfos = deployedContractsGetters.getReserveUnderlyingAssetContracts();
  const reserveAddresses = reserveContractInfos.map((c) => c.address);
  const reserveDatas = await queryProtocolReserveDatas(balanceViewer, reserveAddresses);
  const aTokenGlobal = getContractObject(AToken, LENDING_POOL_ADDRESS, nobody(), api);
  const vTokenGlobal = getContractObject(VToken, LENDING_POOL_ADDRESS, nobody(), api);
  (global as any).lendingPool = lendingPool;
  (global as any).aTokenGlobal = aTokenGlobal;
  (global as any).vTokenGlobal = vTokenGlobal;

  const storedUsers = getStoredUsers();
  const usersToUse = storedUsers.map((su) => ({ mnemonic: su.mnemonic, pair: keyring.addFromUri(su.mnemonic, {}, 'sr25519') }));

  const marketRules = await new ChainDataFetchStrategy().fetchMarketRules();
  const priceFeedProvider = getContractObject(PriceFeedProvider, deployedContractsGetters.getAddress('price_feed_provider'), nobody(), api);
  const prices = (await priceFeedProvider.query.getLatestPrices(reserveContractInfos.map((c) => c.address))).value.unwrap().unwrap();
  const priceMap = prices.reduce(
    (acc, curr, i) => {
      acc[reserveContractInfos[i].address] = curr;
      return acc;
    },
    {} as Record<SUPPORTED_CURRENCIES_TYPE, BN>,
  );
  // for (let i = 0; i < usersToUse.length; i++) {
  //   await borrowUntilUndercollateralized(api, usersToUse, i, lendingPool, signerWithFunds, marketRules, priceMap);
  // }
  for (let i = 0; i < 20; i++) {
    queue.add(() => borrowUntilUndercollateralized(api, usersToUse, i, lendingPool, signerWithFunds, marketRules, priceMap));
  }

  queue.start();
  await queue.onIdle();

  console.log('Finish');
  await api.disconnect();
  process.exit(0);
})(getArgvObj()).catch((e) => {
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});

async function borrowUntilUndercollateralized(
  api: ApiPromise,
  usersToUse: { pair: KeyringPair; mnemonic: string }[],
  i: number,
  lendingPool: LendingPool,
  signerWithFunds: KeyringPair,
  marketRules: Map<number, MarketRule>,
  prices: Record<SUPPORTED_CURRENCIES_TYPE, BN>,
) {
  const user = usersToUse[i];

  const testUSDC = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('USDC_TEST'), user.pair, api);
  const testDOT = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('DOT_TEST'), user.pair, api);
  const testEth = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'), user.pair, api);
  const testBtc = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'), user.pair, api);

  const usdcAmount = parseInt(convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DAI_TEST'])).toString()) * 1;
  const dotAmount = parseInt(convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DOT_TEST'])).toString()) * 2;
  const ethAmount = parseInt(convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['WETH_TEST'])).toString()) * 5;
  const btcAmount = parseInt(convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['BTC_TEST'])).toString()) * 0.000005;

  if (i % 50 === 0) console.log(new Date(), 'Borrow until undercollateralized', `${i} users done`);
  const userSignedLendingPool = lendingPool.withSigner(user.pair);
  const {
    value: { ok: initialCollateralCoeffRes },
  } = await userSignedLendingPool.query.getUserFreeCollateralCoefficient(user.pair.address);
  let collateralCoefficient = initialCollateralCoeffRes![1];

  while (collateralCoefficient && collateralCoefficient.gtn(55_000)) {
    logProgress(collateralCoefficient, user);
    const dataFetchStrategy = new ChainDataFetchStrategy();
    const userData = (await dataFetchStrategy.fetchUserReserveDatas([user.pair.address]))[0];
    const reserveDatas = await dataFetchStrategy.fetchReserveDatas();

    const {
      value: { ok: collateralCoeffRes },
    } = await userSignedLendingPool.query.getUserFreeCollateralCoefficient(user.pair.address);
    const maxBorrowE6 = calculateMaxBorrowE6(
      userData.userConfig,
      reserveDatas,
      userData.userReserves,
      marketRules.get(0)!,
      deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'),
      prices,
      toE6(1.01),
    );
    if (!maxBorrowE6 || maxBorrowE6.eqn(0)) {
      console.log(`user no. ${i} (${user.pair.address}) collateral coefficient greater than 55_000 but max borrow unavailable`);
      break;
    }
    console.log({ maxBorrowE6: maxBorrowE6?.toString() });

    if (collateralCoeffRes && collateralCoeffRes[1].gtn(0)) {
      if (collateralCoeffRes[1].gt(collateralCoeffRes[1])) {
        console.log('COLLATERAL COEFFICIENT INCREASED');
      }
      collateralCoefficient = collateralCoeffRes[1];
      try {
        // await tryBorrow(`usd | user no. ${i} (${user.pair.address})`, userSignedLendingPool, testUSDC, user.pair, usdcAmount, api, signerWithFunds);
        // await tryBorrow(`dot | user no. ${i} (${user.pair.address})`, userSignedLendingPool, testDOT, user.pair, dotAmount, api, signerWithFunds);
        await tryBorrow(
          `eth | user no. ${i} (${user.pair.address})`,
          userSignedLendingPool,
          testEth,
          user.pair,
          convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['WETH_TEST'])).mul(maxBorrowE6).div(E6bn),
          api,
          signerWithFunds,
        );
        // await tryBorrow(`btc | user no. ${i} (${user.pair.address})`, userSignedLendingPool, testBtc, user.pair, btcAmount, api, signerWithFunds);
      } catch (e: any) {
        if (e?.error?.message.includes('account balance too low')) await supplyNativeTAZEROBalance(api, user.pair, signerWithFunds);
        console.error(new Date(), `user no. ${i} (${user.pair.address})`, e);
      }
    } else {
      if (process.env.DEBUG) console.log(new Date(), `user no. ${i} (${user.pair.address}) has not yet performed supply`);
    }
  }
  console.warn(new Date(), user.pair.address, 'Finish', `Current value: ${collateralCoefficient.toString()}`);
}
function logProgress(collateralCoefficient: BN, user: { pair: KeyringPair; mnemonic: string }) {
  if (collateralCoefficient.divRound(new BN(200000)).gtn(0))
    console.log(new Date(), user.pair.address, 'Above 200_000', `Current value: ${collateralCoefficient.toString()}`);
  else if (collateralCoefficient.divRound(new BN(150000)).gtn(0))
    console.log(new Date(), user.pair.address, 'Above 150_000', `Current value: ${collateralCoefficient.toString()}`);
  else if (collateralCoefficient.divRound(new BN(100000)).gtn(0))
    console.log(new Date(), user.pair.address, 'Above 100_000', `Current value: ${collateralCoefficient.toString()}`);
}

async function tryBorrow(
  label: string,
  lendingPool: LendingPool,
  psp22: Psp22Ownable,
  userPair: KeyringPair,
  amount: BN,
  api: ApiPromise,
  signerWithFunds: KeyringPair,
) {
  const queryRes = await lendingPool.withSigner(userPair).query.borrow(psp22.address, userPair.address, amount, []);
  try {
    queryRes.value.unwrapRecursively();
    await lendingPool.withSigner(userPair).tx.borrow(psp22.address, userPair.address, amount, []);
  } catch (e: any) {
    if (e?.error?.message.includes('account balance too low')) await supplyNativeTAZEROBalance(api, userPair, signerWithFunds);
    console.error(new Date(), label, e);
  }
}
export const calculateMaxBorrowE6 = (
  userConfig: UserConfig,
  reserveDatas: Record<string, ReserveDataWithMetadata>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
  reserveAddressToBeBorrowed: string,
  prices: Record<string, BN>,
  minimalHealthFactorE6: number,
): BN | null => {
  const reserveData = reserveDatas[reserveAddressToBeBorrowed];
  const assetRule = marketRule[reserveData.id];
  const borrowCoefficientE6 = assetRule?.borrowCoefficientE6;

  if (!borrowCoefficientE6) return null;
  const collateralPowerE6 = calculateCollateralPowerE6BN(userConfig, reserveDatas, userReserveDatas, marketRule, prices);
  const debtPowerE6 = calculateDebtPowerE6BN(
    Object.fromEntries(Object.entries(reserveDatas)) as Record<string, ReserveDataWithMetadata>,
    userReserveDatas,
    marketRule,
    prices,
  );
  const freeCollateralPowerE6 = collateralPowerE6.mul(E6bn).divn(minimalHealthFactorE6).sub(debtPowerE6);
  if (freeCollateralPowerE6.isNeg() || freeCollateralPowerE6.isZero()) return new BN(0);
  const priceE18 = prices[reserveAddressToBeBorrowed];
  const maxDebtE6 = freeCollateralPowerE6.mul(E18bn).mul(E6bn).div(priceE18).div(borrowCoefficientE6);

  return maxDebtE6;
};

export const calculateDebtPowerE6BN = (
  reserveDatas: Record<string, ReserveDataWithMetadata>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
  prices: Record<string, BN>,
) => {
  let ret = new BN(0);
  Object.entries(reserveDatas).forEach((entry) => {
    let retDenom = new BN(1);
    const [reserveAddress, reserveData] = entry as [string, ReserveDataWithMetadata];
    const assetRule = marketRule[reserveData.id];
    if (!reserveData.decimalMultiplier || !assetRule?.borrowCoefficientE6 || !prices[reserveAddress]) return;
    const userReserveData = userReserveDatas[reserveAddress];
    const debt = userReserveData.debt;
    const debtDecimals = reserveData.decimalMultiplier;
    retDenom = retDenom.mul(debtDecimals);
    const priceE18 = prices[reserveAddress] ?? new BN(0);
    retDenom = retDenom.mul(E18bn);
    const borrowCoefficient = assetRule.borrowCoefficientE6;
    ret = ret.add(debt.mul(priceE18).mul(borrowCoefficient).div(retDenom));
  });

  return ret;
};

export const calculateCollateralPowerE6BN = (
  userConfig: UserConfig,
  reserveDatas: Record<string, ReserveDataWithMetadata>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
  prices: Record<string, BN>,
) => {
  let ret = new BN(0);
  Object.keys(reserveDatas).forEach((reserveAddress) => {
    let retDenom = new BN(1);
    const reserveData = reserveDatas[reserveAddress];
    if (!getIsUsedAsCollateral(userConfig, reserveData)) return;

    const assetRule = marketRule[reserveData.id];
    const deposit = userReserveDatas[reserveAddress].deposit;
    const decimalMultiplier = reserveData.decimalMultiplier ?? new BN(1);

    retDenom = retDenom.mul(decimalMultiplier);
    const priceE18 = prices[reserveAddress] ?? new BN(0);
    retDenom = retDenom.mul(E18bn);
    const collateralCoefficientE6 = assetRule && assetRule.collateralCoefficientE6 ? assetRule.collateralCoefficientE6 : new BN(0);
    ret = ret.add(deposit.mul(priceE18).mul(collateralCoefficientE6).div(retDenom));
  });

  return ret;
};
