import { E12, E6bn, E6, E12bn, E8 } from '@abaxfinance/utils';
import { logger } from '@src/logger';
import { PRICE_SOURCE, type AnyRegisteredAsset } from '@src/price-updating/consts';
import type { PriceFetchStrategy } from '@src/price-updating/price-fetch-strategy/PriceFetchStrategy';
import { getKeyByValue } from '@src/utils';
import BN from 'bn.js';
import type { OrderBook } from 'ccxt';
import ccxt from 'ccxt';
type AnyMarket = 'AZERO/USDT' | 'BTC/USDT' | 'USDC/USDT' | 'ETH/USDT' | 'DOT/USDT' | 'USDT/DAI';

const MARKET_SYMBOLS_BY_RESERVE_NAME = {
  AZERO: 'AZERO/USDT',
  BTC: 'BTC/USDT',
  USDC: 'USDC/USDT',
  ETH: 'ETH/USDT',
  DOT: 'DOT/USDT',
  DAI: 'USDT/DAI', //TODO
} satisfies Record<AnyRegisteredAsset, AnyMarket>;
export class KuCoinPriceFetchStrategy implements PriceFetchStrategy {
  priceSource: PRICE_SOURCE = PRICE_SOURCE.KUCOIN;
  async fetchPricesE18() {
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
      logger.error(e);
      throw new Error('Error during fetchOrderBook');
    }
    logger.debug('fetching order book...');
    const orderbooks = await Promise.all(pricePromises);
    logger.debug('Fetched order book...');
    const currentPricesE18 = orderbooks.map((curr) => {
      logger.info(`${getKeyByValue(MARKET_SYMBOLS_BY_RESERVE_NAME, curr.marketPair)} | original value  ${curr.ob.bids[0][0]}`);
      logger.info(`${getKeyByValue(MARKET_SYMBOLS_BY_RESERVE_NAME, curr.marketPair)} | value after mul ${(curr.ob.bids[0][0]! * E8).toString()}`);
      logger.info(
        `${getKeyByValue(MARKET_SYMBOLS_BY_RESERVE_NAME, curr.marketPair)} | value passed to BN ${Math.floor(curr.ob.bids[0][0]! * E8).toString()}`,
      );
      const E4bn = new BN((10 ** 4).toString());
      return [
        getKeyByValue(MARKET_SYMBOLS_BY_RESERVE_NAME, curr.marketPair),
        new BN(Math.floor(curr.ob.bids[0][0]! * E8).toString()).mul(E6bn).mul(E4bn),
      ] as [AnyRegisteredAsset, BN];
    });

    return currentPricesE18;
  }
}
