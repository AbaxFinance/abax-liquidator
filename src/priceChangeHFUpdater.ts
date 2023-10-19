import { db } from 'db';
import { assetPrices } from 'db/schema';
import { sleep } from 'scripts/common';
import { ONE_SECOND } from 'src/constants';

const LOOP_INTERVAL = process.env.LOOP_INTERVAL ?? 5 * ONE_SECOND;
export class PriceChangeHFUpdater {
  async runLoop() {
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

      const assetPriceData = await db.select().from(assetPrices);

      await sleep(LOOP_INTERVAL);
    }
  }
}
