import { getArgvObj } from 'wookashwackomytest-utils';
import { apiProviderWrapper } from '@scripts/common';
import chalk from 'chalk';

(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const api = await apiProviderWrapper.getAndWaitForReady();
  console.log(api.tx);
  //code
  process.exit(0);
})(getArgvObj()).catch((e) => {
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
