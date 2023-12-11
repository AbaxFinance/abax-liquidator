import { E8 } from '@abaxfinance/utils';
import { db } from '@db/index';
import { assetPrices } from '@db/schema';
import { BaseActor } from '@src/base-actor/BaseActor';
import { deployedContractsGetters } from '@src/deployedContracts';
import { logger } from '@src/logger';
import type { OrderBook } from 'ccxt';
import ccxt from 'ccxt';
import { sql } from 'drizzle-orm';

type AnyMarket = 'AZERO/USDT' | 'BTC/USDT' | 'USDC/USDT' | 'ETH/USDT' | 'DOT/USDT' | 'USDT/DAI';
type AnyRegisteredAsset = 'AZERO' | 'BTC' | 'USDC' | 'ETH' | 'DOT' | 'DAI';

const MARKET_SYMBOLS_BY_RESERVE_NAME = {
  AZERO: 'AZERO/USDT',
  BTC: 'BTC/USDT',
  USDC: 'USDC/USDT',
  ETH: 'ETH/USDT',
  DOT: 'DOT/USDT',
  DAI: 'USDT/DAI', //TODO
} satisfies Record<AnyRegisteredAsset, AnyMarket>;

export const PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME = {
  AZERO: 0.02,
  BTC: 0.02,
  USDC: 0.02,
  ETH: 0.02,
  DOT: 0.02,
  DAI: 0.02, //TODO
} satisfies Record<AnyRegisteredAsset, number>;
export function recordEntries<K extends PropertyKey, T>(object: Record<K, T>) {
  return Object.entries(object) as [K, T][];
}

function getKeyByValue<K extends PropertyKey, T>(obj: Record<K, T>, value: T) {
  const foundKey = recordEntries(obj).find(([, name]) => value === name)![0];
  return foundKey;
}

const INIT_ASSET_PRICE_DATA = [
  {
    name: 'AZERO',
    address: deployedContractsGetters.getReserveUnderlyingAddress('AZERO_TEST'),
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'BTC',
    address: deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'),
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'USDC',
    address: deployedContractsGetters.getReserveUnderlyingAddress('USDC_TEST'),
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'ETH',
    address: deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'),
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'DOT',
    address: deployedContractsGetters.getReserveUnderlyingAddress('DOT_TEST'),
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'DAI',
    address: deployedContractsGetters.getReserveUnderlyingAddress('DAI_TEST'),
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
];

export class PriceUpdater extends BaseActor {
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

    const assetPriceData = await db.select().from(assetPrices);
    logger.debug('Inserting data...');

    const updateTs = new Date();
    const valuesToInsert = (assetPriceData.length > 0 ? assetPriceData : INIT_ASSET_PRICE_DATA).map((apd) => {
      const currentPriceE8 = currentPricesE8.find((cp) => cp[0] === apd.name)![1];
      return {
        address: apd.address,
        name: apd.name,
        updateTimestamp: updateTs,
        currentPriceE8: currentPriceE8.toString(),
        anchorPriceE8:
          // eslint-disable-next-line no-constant-condition
          true || //TODO
          Math.abs(parseInt(apd.anchorPriceE8) - currentPriceE8) / parseInt(apd.anchorPriceE8) > PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME[apd.name]
            ? currentPriceE8.toString()
            : apd.anchorPriceE8,
      };
    });
    await db
      .insert(assetPrices)
      .values(valuesToInsert)
      .onConflictDoUpdate({
        target: assetPrices.address,
        set: {
          ...Object.fromEntries(Object.keys(assetPrices).map((x) => [x, sql.raw(`excluded."${x}"`)])),
        },
      });
  }
}
