import { sleep } from 'scripts/common';
import { logger } from 'src/logger';

export class UserDataChainUpdater {
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      logger.info('UserDataChainUpdater', 'running...');
      await sleep(10 * 1000);
    }
  }
}
