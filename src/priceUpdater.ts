import { db } from 'db';
import { assetPrices } from 'db/schema';
import { sleep } from 'scripts/common';
import { ONE_SECOND } from 'src/constants';
import { E8 } from '@abaxfinance/utils';
import ccxt, { OrderBook } from 'ccxt';
import { sql } from 'drizzle-orm';

//TOOD better logging

const LOOP_INTERVAL = process.env.LOOP_INTERVAL ?? 5 * ONE_SECOND;

type AnyMarket = 'AZERO/USDT' | 'BTC/USDT' | 'USDC/USDT' | 'ETH/USDT' | 'DOT/USDT';
type AnyRegisteredAsset = 'AZERO' | 'BTC' | 'USDC' | 'ETH' | 'DOT';

const MARKET_SYMBOLS_BY_RESERVE_NAME = {
  AZERO: 'AZERO/USDT',
  BTC: 'BTC/USDT',
  USDC: 'USDC/USDT',
  ETH: 'ETH/USDT',
  DOT: 'DOT/USDT',
} satisfies Record<AnyRegisteredAsset, AnyMarket>;

const PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME = {
  AZERO: 0.02,
  BTC: 0.02,
  USDC: 0.02,
  ETH: 0.02,
  DOT: 0.02,
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
    address: 'AZERO_addr',
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'BTC',
    address: 'BTC_addr',
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'USDC',
    address: 'USDC_addr',
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'ETH',
    address: 'ETH_addr',
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
  {
    name: 'DOT',
    address: 'DOT_addr',
    currentPriceE8: 0,
    anchorPriceE8: 0,
    updateTimestamp: 0,
  },
];

export class PriceUpdater {
  async runLoop() {
    const kucoinExchange = new ccxt.kucoin();
    console.log('Loading kucoin markets....');
    await kucoinExchange.loadMarkets();
    console.log('Kucoin markets loaded...');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('PriceChangeHFUpdater', 'running...');

      //       1. pseudocode:
      //       listen on anchorPrice change (polling)
      //       get all user related datas
      //       recalculate HF
      //       via rust worker(?)
      //       update db (hf & updateAtLatest)
      //    1. Q:

      //    - threshold? - prices table? - every N seconds (5?):
      //      fetch all prices
      //      update prices table - insert currentPrice - if abs(currentPrice - anchorPrice) > getThreshold() - anchorPrice <-- currentPrice - insert updateTimestamp

      const pricePromises: Promise<{ marketPair: AnyMarket; ob: OrderBook }>[] = [];
      try {
        for (const marketPair of Object.values(MARKET_SYMBOLS_BY_RESERVE_NAME)) {
          pricePromises.push(kucoinExchange.fetchOrderBook(marketPair).then((ob) => ({ marketPair, ob })));
        }
      } catch (e) {
        console.error('Error during fetchOrderBook', e);
        await sleep(LOOP_INTERVAL);
        continue;
      }
      console.log('fetching order book...');
      const orderbooks = await Promise.all(pricePromises);
      console.log('Fetched order book...');
      const currentPricesE8 = orderbooks.map(
        (curr) => [getKeyByValue(MARKET_SYMBOLS_BY_RESERVE_NAME, curr.marketPair), curr.ob.bids[0][0] * E8] as [AnyRegisteredAsset, number],
      );

      const assetPriceData = await db.select().from(assetPrices);
      console.log('Inserting data...');

      const updateTs = new Date().getTime();
      console.log('assetPriceData', assetPriceData);
      const valuesToInsert = (assetPriceData.length > 0 ? assetPriceData : INIT_ASSET_PRICE_DATA).map((apd) => {
        const currentPriceE8 = currentPricesE8.find((cp) => cp[0] === apd.name)![1];
        return {
          address: apd.address,
          name: apd.name,
          updateTimestamp: updateTs,
          currentPriceE8: currentPriceE8.toString(),
          anchorPriceE8:
            Math.abs(parseInt(apd.anchorPriceE8) - currentPriceE8) / parseInt(apd.anchorPriceE8) > PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME[apd.name]
              ? currentPriceE8.toString()
              : apd.anchorPriceE8,
        };
      });
      console.log('valuesToInsert', valuesToInsert);
      await db
        .insert(assetPrices)
        .values(valuesToInsert)
        .onConflictDoUpdate({
          target: assetPrices.address,
          set: {
            address: sql`excluded.address`,
            name: sql`excluded.name`,
            updateTimestamp: sql`excluded.updateTimestamp`,
            currentPriceE8: sql`excluded.currentPriceE8`,
            anchorPriceE8: sql`excluded.anchorPriceE8`,
          },
        });

      await sleep(LOOP_INTERVAL);
    }
  }
}
