import { sleep } from 'scripts/common';
import { logger } from 'src/logger';

export class ReserveDataChainUpdater {
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      logger.info('ReserveDataChainUpdater', 'running...');
      await sleep(8 * 1000);
    }
  }
}
