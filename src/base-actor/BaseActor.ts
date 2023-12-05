import { logger } from '@src/logger';
import { sleep } from 'scripts/common';

export abstract class BaseActor {
  async runLoop(): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      logger.info(`${this.constructor.name} running loop...`);
      await sleep(8 * 1000);
    }
  }
}
