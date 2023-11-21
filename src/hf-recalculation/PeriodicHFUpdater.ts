import { ReturnNumber } from '@727-ventures/typechain-types';
import {
  AccountId,
  BalanceViewer,
  CompleteReserveData,
  LendingPool,
  MarketRule,
  ReserveData,
  UserConfig,
  UserReserveData,
  getContractObject,
} from '@abaxfinance/contract-helpers';
import { db } from 'db';
import { assetPrices, lpTrackingData, lpUserConfigs, lpUserDatas } from 'db/schema';
import { eq, inArray, lt } from 'drizzle-orm';
import { ApiProviderWrapper, sleep } from 'scripts/common';
import { BALANCE_VIEWER_ADDRESS, LENDING_POOL_ADDRESS, getIsUsedAsCollateral } from 'src/utils';
import { nobody } from '@polkadot/keyring/pair/nobody';
import { E12bn, E18bn, E6, E6bn, E8 } from '@abaxfinance/utils';
import { deployedContracts } from 'src/deployedContracts';
import BN from 'bn.js';
import { ReserveDataWithMetadata } from 'src/types';

const MARKET_RULE_IDS = [0, 1, 2] as const;

export class PeriodicHFUpdater {
  fetchDataStrategy; //TODO
  wsEndpoint: string;

  constructor() {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
  }

  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('PeriodicHFUpdater', 'running...');

      //TODO chunks
      const addressesToUpdate = (
        await db.select({ address: lpTrackingData.address }).from(lpTrackingData).where(lt(lpTrackingData.updateAtLatest, new Date()))
      ).map((a) => a.address);
      console.log(`Updating HF for ${addressesToUpdate.length} addresses...`);
      const reserveAddresses = deployedContracts['alephzero-testnet'].filter((c) => c.name.startsWith('psp22')).map((c) => c.address);

      //TODO move to strategy START
      const { usersWithReserveDatas, marketRules, reserveDatas } = await this.getAllDataFromChain(reserveAddresses, addressesToUpdate);
      //TODO move to strategy END

      const pricesE18ByReserveAddress = await getPricesE18ByReserveAddressFromDb(reserveAddresses);

      for (const { userConfig, userReserves, userAddress } of usersWithReserveDatas) {
        const userAppliedMarketRule = marketRules.get(userConfig.marketRuleId.toNumber())!;
        const { debtPower, biggestDebtData } = getDebtPowerE6BNAndBiggestLoan(
          reserveDatas,
          pricesE18ByReserveAddress,
          userReserves,
          userAppliedMarketRule,
        );
        if (debtPower.eqn(0)) continue;
        const { collateralPower, biggestCollateralData } = getCollateralPowerE6AndBiggestDeposit(
          userConfig,
          reserveDatas,
          pricesE18ByReserveAddress,
          userReserves,
          userAppliedMarketRule,
        );
        const healthFactor = parseFloat(collateralPower.mul(E6bn).div(debtPower).toString()) / E6;
        //send message to liquidator if necesary
        if (collateralPower.lte(debtPower)) {
          console.log(`${userAddress} CP: ${collateralPower.toString()} | DP: ${debtPower.toString()}`);
          //
          //rabbitMQChannel.sendToQueue(liquidationQueue, Buffer.from(JSON.stringify({userAddress, })));
          console.log(`${userAddress} should be liquidated | HF: ${healthFactor}`);
        }
        // console.log(`${userAddress} is safe | HF: ${healthFactor}`);

        //update db
      }
      console.log('PeriodicHFUpdater', 'sleeping for 5 seconds...');
      await sleep(5 * 1000);
    }
  }
  async getAllDataFromChain(reserveAddresses: string[], userAddresses: string[]) {
    const signer = nobody();
    const apiProviderWrapper = new ApiProviderWrapper(this.wsEndpoint);
    const apiFromProviderWrapper = await apiProviderWrapper.getAndWaitForReady();
    const balanceViewerL = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, apiFromProviderWrapper);
    const reserveDatas = await fetchProtocolReserveDatas(balanceViewerL, reserveAddresses);

    const usersWithReserveDatas: ProtocolUserDataReturnType[] = [];
    const CHUNK_SIZE = 15;
    const apiProviderWrapperForUserDataFetch = new ApiProviderWrapper(this.wsEndpoint);
    try {
      for (let i = 0; i < userAddresses.length; i += CHUNK_SIZE) {
        const currentChunk = userAddresses.slice(i, i + CHUNK_SIZE);
        console.log(`fetching user data chunk (${i - CHUNK_SIZE}-${i})...`);
        const api = await apiProviderWrapperForUserDataFetch.getAndWaitForReadyNoCache();
        const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
        const balanceViewer = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, api);
        const currentChunkRes = await Promise.all(currentChunk.map((ad) => getProtocolUserDataFromChain(lendingPool, balanceViewer, ad)));
        usersWithReserveDatas.push(...currentChunkRes);
        await api.disconnect();
        await apiProviderWrapperForUserDataFetch.closeApi();
      }
    } catch (e) {
      console.log('error while fetching user data...');
      console.log(e);
      process.exit(1);
    }

    const marketRules = new Map<number, MarketRule>();
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, apiFromProviderWrapper);
    for (const id of MARKET_RULE_IDS) {
      //TODO strategy
      // if (!marketRules.has(userConfig.marketRuleId.toString())) {
      console.log(`fetching market rule.... ${id}`);
      const {
        value: { ok: marketRule },
      } = await lendingPool.query.viewMarketRule(id);
      marketRules.set(id, marketRule!);
      // }
    }
    await apiProviderWrapper.closeApi();
    return { usersWithReserveDatas, marketRules, reserveDatas };
  }
}

async function fetchProtocolReserveDatas(balanceViewer: BalanceViewer, reserveAddresses: string[]) {
  const reserveDatasRet = await Promise.all(
    reserveAddresses.map((addr) => balanceViewer.query.viewCompleteReserveData(addr).then((res) => [addr, res])),
  );
  const reserveDatasRetVal = reserveDatasRet.map((rt) => [rt[0], (rt[1] as any).value.unwrapRecursively()]) as [string, CompleteReserveData][];
  return reserveDatasRetVal.reduce((acc, [addr, rd], i) => {
    acc[addr] = { ...rd, id: i };
    return acc;
  }, {} as Record<string, ReserveDataWithMetadata>);
}

export const getCollateralPowerE6AndBiggestDeposit = (
  userConfig: UserConfig,
  reserveDatasByAddress: Record<string, ReserveDataWithMetadata>,
  pricesE18ByReserveAddress: Record<string, BN>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
) => {
  let ret = new BN(0);
  const biggestCollateralData: {
    amountRawE6: BN;
    underlyingAddress: string;
  } = {
    underlyingAddress: '',
    amountRawE6: new BN(0),
  };
  Object.entries(userReserveDatas).forEach(([reserveAddress, userReserveData]) => {
    let retDenom = new BN(1);
    const reserveData = reserveDatasByAddress[reserveAddress];
    if (!getIsUsedAsCollateral(userConfig, reserveData)) return;

    const assetRule = marketRule[reserveData.id];
    const deposit = userReserveData.deposit.rawNumber;
    const decimalMultiplier = reserveData.decimalMultiplier?.rawNumber ?? new BN(1);
    retDenom = retDenom.mul(decimalMultiplier);
    const priceE18 = pricesE18ByReserveAddress[reserveAddress] ?? new BN(0);
    retDenom = retDenom.mul(E18bn);
    const collateralCoefficientE6 = assetRule && assetRule.collateralCoefficientE6 ? assetRule.collateralCoefficientE6.rawNumber : new BN(0);
    const reserveCollateral = deposit.mul(priceE18).mul(collateralCoefficientE6).div(retDenom);
    ret = ret.add(reserveCollateral);
    //biggest collateral data
    if (biggestCollateralData.amountRawE6.lt(reserveCollateral)) {
      biggestCollateralData.underlyingAddress = reserveAddress;
      biggestCollateralData.amountRawE6 = reserveCollateral;
    }
  });

  return { collateralPower: ret, biggestCollateralData };
};

export const getDebtPowerE6BNAndBiggestLoan = (
  reserveDatas: Record<string, ReserveDataWithMetadata>,
  pricesE18ByReserveAddress: Record<string, BN>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
) => {
  let ret = new BN(0);
  const biggestDebtData: {
    amountRawE6: BN;
    underlyingAddress: string;
  } = {
    underlyingAddress: '',
    amountRawE6: new BN(0),
  };
  Object.entries(userReserveDatas).forEach(([reserveAddress, userReserveData]) => {
    let retDenom = new BN(1);
    const reserveData = reserveDatas[reserveAddress];
    const assetRule = marketRule[reserveData.id];
    const price = pricesE18ByReserveAddress[reserveAddress];
    if (!reserveData.decimalMultiplier || !assetRule?.borrowCoefficientE6 || !price) return;
    const debt = userReserveData.debt.rawNumber;
    const debtDecimals = reserveData.decimalMultiplier.rawNumber;
    retDenom = retDenom.mul(debtDecimals);
    retDenom = retDenom.mul(E18bn);
    const borrowCoefficient = assetRule.borrowCoefficientE6.rawNumber;
    const reserveDebt = debt.mul(price).mul(borrowCoefficient).div(retDenom);
    ret = ret.add(reserveDebt);
    //biggest loan data
    if (biggestDebtData.amountRawE6.lt(reserveDebt)) {
      biggestDebtData.underlyingAddress = reserveAddress;
      biggestDebtData.amountRawE6 = reserveDebt;
    }
  });

  return { debtPower: ret, biggestDebtData };
};

type ProtocolUserDataReturnType = {
  userConfig: UserConfig;
  userReserves: Record<string, UserReserveData>;
  userAddress: AccountId;
};

async function getProtocolUserDataFromChain(
  lendingPool: LendingPool,
  balanceViewer: BalanceViewer,
  userAddress: AccountId,
): Promise<ProtocolUserDataReturnType> {
  const [
    {
      value: { ok: userConfigRet },
    },
    {
      value: { ok: userReservesRet },
    },
  ] = await Promise.all([lendingPool.query.viewUserConfig(userAddress), balanceViewer.query.viewUserReserveDatas(null, userAddress)]);
  const userReserves = userReservesRet!.reduce((acc, [reserveAddress, reserve]) => {
    acc[reserveAddress.toString()] = reserve;
    return acc;
  }, {} as Record<string, UserReserveData>);
  return {
    userConfig: userConfigRet!,
    userReserves,
    userAddress,
  };
}

async function getProtocolUserDataFromDB(userAddress: AccountId): Promise<ProtocolUserDataReturnType> {
  const userConfigRows = await db.select().from(lpUserConfigs).where(eq(lpUserConfigs.address, userAddress.toString()));
  if (userConfigRows.length > 1) console.warn(`more than 1 user config in the database for address: ${userAddress.toString()}`);
  if (userConfigRows.length === 0) console.warn(`no user config in the database for address: ${userAddress.toString()}`);
  const userConfig: UserConfig = {
    deposits: new ReturnNumber(userConfigRows[0].deposits),
    collaterals: new ReturnNumber(userConfigRows[0].collaterals),
    borrows: new ReturnNumber(userConfigRows[0].borrows),
    marketRuleId: new ReturnNumber(userConfigRows[0].marketRuleId),
  };
  const userReserveDatas = await db.select().from(lpUserDatas).where(eq(lpUserDatas.address, userAddress.toString()));
  const userReserves = userReserveDatas.reduce((acc, curr) => {
    acc[curr.address] = {
      deposit: new ReturnNumber(curr.deposit),
      debt: new ReturnNumber(curr.debt),
      appliedCumulativeDepositIndexE18: new ReturnNumber(curr.appliedCumulativeDepositIndexE18),
      appliedCumulativeDebtIndexE18: new ReturnNumber(curr.appliedCumulativeDebtIndexE18),
    };
    return acc;
  }, {} as Record<string, UserReserveData>);

  return { userConfig, userReserves, userAddress };
}

async function getPricesE18ByReserveAddressFromDb(reserveAddresses: string[]) {
  const pricesE8ByReserveAddressFromDb = await db
    .select({ currentPrice: assetPrices.currentPriceE8, address: assetPrices.address })
    .from(assetPrices)
    .where(inArray(assetPrices.address, reserveAddresses));

  return pricesE8ByReserveAddressFromDb.reduce((acc, { currentPrice, address }) => {
    try {
      acc[address] = new BN((parseFloat(currentPrice) * E8).toString()).mul(E12bn).divn(10 ** 2);
    } catch (e) {
      console.log(e, currentPrice, address);
      throw e;
    }
    return acc;
  }, {} as Record<string, BN>);
}
