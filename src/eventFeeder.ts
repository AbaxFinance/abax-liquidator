import { sleep } from 'scripts/common';

export class EventFeeder {
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('EventFeeder', 'running...');
      await sleep(1 * 1000);
    }
  }
}
