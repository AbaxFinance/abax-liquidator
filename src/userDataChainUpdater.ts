import { sleep } from 'scripts/common';

export class UserDataChainUpdater {
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('UserDataChainUpdater', 'running...');
      await sleep(10 * 1000);
    }
  }
}
