import { sleep } from 'scripts/common';

export class ReserveDataChainUpdater {
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('ReserveDataChainUpdater', 'running...');
      await sleep(8 * 1000);
    }
  }
}
