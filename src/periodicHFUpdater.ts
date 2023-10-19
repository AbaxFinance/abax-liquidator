import { sleep } from 'scripts/common';

export class PeriodicHFUpdater {
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('PeriodicHFUpdater', 'running...');
      await sleep(5 * 1000);
    }
  }
}
