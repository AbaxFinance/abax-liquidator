import type { MarketRule } from '@abaxfinance/contract-helpers';
import { BalanceViewer, LendingPool, getContractObject } from '@abaxfinance/contract-helpers';
import { nobody } from '@polkadot/keyring/pair/nobody';
import { queryProtocolReserveDatas, queryProtocolUserData } from '@src/common/chain-data-utils';
import { MARKET_RULE_IDS } from '@src/constants';
import { deployedContractsGetters } from '@src/deployedContracts';
import type { DataFetchStrategy, ProtocolUserDataReturnType } from '@src/hf-recalculation/DataFetchStrategy';
import { logger } from '@src/logger';
import { BALANCE_VIEWER_ADDRESS, LENDING_POOL_ADDRESS } from '@src/utils';
import { ApiProviderWrapper } from '@abaxfinance/contract-helpers';
export class ChainDataFetchStrategy implements DataFetchStrategy {
  wsEndpoint: string;
  apiProviderWrapper: ApiProviderWrapper;

  constructor() {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
    this.apiProviderWrapper = new ApiProviderWrapper(this.wsEndpoint);
  }

  async fetchReserveDatas(reserveAddressesArg?: string[]) {
    let reserveAddresses = reserveAddressesArg;
    if (!reserveAddresses) {
      reserveAddresses = deployedContractsGetters.getReserveUnderlyingAssetContracts().map((c) => c.address);
    }
    const signer = nobody();
    const apiFromProviderWrapper = await this.apiProviderWrapper.getAndWaitForReady();
    const balanceViewerL = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, apiFromProviderWrapper);
    const reserveDatas = await queryProtocolReserveDatas(balanceViewerL, reserveAddresses);
    await this.apiProviderWrapper.closeApi();
    return reserveDatas;
  }

  async fetchMarketRules() {
    const signer = nobody();
    const apiFromProviderWrapper = await this.apiProviderWrapper.getAndWaitForReady();
    const marketRules = new Map<number, MarketRule>();
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, apiFromProviderWrapper);
    for (const id of MARKET_RULE_IDS) {
      const {
        value: { ok: marketRule },
      } = await lendingPool.query.viewMarketRule(id);
      marketRules.set(id, marketRule!);
    }
    return marketRules;
  }

  async fetchUserReserveDatas(userAddresses: string[]) {
    const signer = nobody();
    const usersWithReserveDatas: ProtocolUserDataReturnType[] = [];
    const CHUNK_SIZE = 10;
    const apiProviderWrapperForUserDataFetch = new ApiProviderWrapper(this.wsEndpoint);
    try {
      for (let i = 0; i < userAddresses.length; i += CHUNK_SIZE) {
        const currentChunk = userAddresses.slice(i, i + CHUNK_SIZE);
        if (userAddresses.length > CHUNK_SIZE) logger.info(`fetching user data chunk (${i}-${i + CHUNK_SIZE})...`);
        const api = await apiProviderWrapperForUserDataFetch.getAndWaitForReadyNoCache();
        const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
        const balanceViewer = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, api);
        const currentChunkRes = await Promise.all(currentChunk.map((ad) => queryProtocolUserData(lendingPool, balanceViewer, ad)));
        usersWithReserveDatas.push(...currentChunkRes);
        await api.disconnect();
        await apiProviderWrapperForUserDataFetch.closeApi();
      }
    } catch (e) {
      logger.info('error while fetching user data...');
      logger.info(e);
      process.exit(1);
    }
    return usersWithReserveDatas;
  }
}
