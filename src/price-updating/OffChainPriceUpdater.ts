import { E8 } from '@abaxfinance/utils';
import { db } from '@db/index';
import { assetPrices, type InsertAssetPrice } from '@db/schema';
import { BaseActor } from '@src/base-actor/BaseActor';
import { deployedContractsGetters } from '@src/deployedContracts';
import { logger } from '@src/logger';
import { insertPricesIntoDb } from '@src/price-updating/common';
import { PRICE_SOURCE, type AnyRegisteredAsset, INIT_ASSET_PRICE_DATA, PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME } from '@src/price-updating/consts';
import { getKeyByValue } from '@src/utils';
import type { OrderBook } from 'ccxt';
import ccxt from 'ccxt';
import { eq, sql } from 'drizzle-orm';

type AnyMarket = 'AZERO/USDT' | 'BTC/USDT' | 'USDC/USDT' | 'ETH/USDT' | 'DOT/USDT' | 'USDT/DAI';

const MARKET_SYMBOLS_BY_RESERVE_NAME = {
  AZERO: 'AZERO/USDT',
  BTC: 'BTC/USDT',
  USDC: 'USDC/USDT',
  ETH: 'ETH/USDT',
  DOT: 'DOT/USDT',
  DAI: 'USDT/DAI', //TODO
} satisfies Record<AnyRegisteredAsset, AnyMarket>;

export class OffChainPriceUpdater extends BaseActor {
  async loopAction() {
    const kucoinExchange = new ccxt.kucoin();
    logger.debug('Loading kucoin markets....');
    await kucoinExchange.loadMarkets();
    logger.debug('Kucoin markets loaded...');
    const pricePromises: Promise<{ marketPair: AnyMarket; ob: OrderBook }>[] = [];
    // logger.info(
    //   'symbols',
    //   kucoinExchange.symbols.filter((s) => s.includes('DAI')),
    // );
    // process.exit(1);
    try {
      for (const marketPair of Object.values(MARKET_SYMBOLS_BY_RESERVE_NAME)) {
        pricePromises.push(kucoinExchange.fetchOrderBook(marketPair).then((ob) => ({ marketPair, ob })));
      }
    } catch (e) {
      logger.error('Error during fetchOrderBook', e);
      return;
    }
    logger.debug('fetching order book...');
    const orderbooks = await Promise.all(pricePromises);
    logger.debug('Fetched order book...');
    const currentPricesE8 = orderbooks.map(
      (curr) => [getKeyByValue(MARKET_SYMBOLS_BY_RESERVE_NAME, curr.marketPair), curr.ob.bids[0][0]! * E8] as [AnyRegisteredAsset, number],
    );

    await insertPricesIntoDb(currentPricesE8, PRICE_SOURCE.KUCOIN);
  }
}
