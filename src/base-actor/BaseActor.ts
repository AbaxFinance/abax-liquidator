import { ONE_SECOND } from '@src/constants';
import { logger } from '@src/logger';
import { sleep } from 'scripts/common';

const LOOP_INTERVAL = process.env.LOOP_INTERVAL ? parseInt(process.env.LOOP_INTERVAL) : 5 * ONE_SECOND;
export abstract class BaseActor {
  printRunLoopMessage() {}
  async runLoop(): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      logger.info(`${this.constructor.name} running loop...`);
      await this.loopAction();
      logger.info(`${this.constructor.name} sleeping for ${LOOP_INTERVAL / 1000} seconds...`);
      await sleep(LOOP_INTERVAL);
    }
  }

  async loopAction(): Promise<void> {
    logger.warn('Action not implemented!');
  }
}
