import { sleep } from 'scripts/common';

export class Liquidator {
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('Liquidator', 'running...');
      await sleep(3 * 1000);
    }
  }
}
