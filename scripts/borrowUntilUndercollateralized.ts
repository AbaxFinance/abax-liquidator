import { LendingPool, Psp22Ownable, getContractObject } from '@abaxfinance/contract-helpers';
import { convertToCurrencyDecimalsStatic, getArgvObj } from '@abaxfinance/utils';
import { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import { nobody } from '@polkadot/keyring/pair/nobody';
import type { KeyringPair } from '@polkadot/keyring/types';
import { getStoredUsers } from '@scripts/supplyAndBorrow1000Users';
import { deployedContractsGetters } from '@src/deployedContracts';
import { LENDING_POOL_ADDRESS } from '@src/utils';
import BN from 'bn.js';
import chalk from 'chalk';
import PQueue from 'p-queue';
import { apiProviderWrapper } from 'scripts/common';

const keyring = new Keyring();
(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const api = await apiProviderWrapper.getAndWaitForReady();

  const signer = nobody();
  const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);

  const storedUsers = getStoredUsers();
  const usersToUse = storedUsers.map((su) => ({ mnemonic: su.mnemonic, pair: keyring.addFromUri(su.mnemonic, {}, 'sr25519') }));

  const queue = new PQueue({ concurrency: 25, autoStart: false });

  // for (let i = 0; i < usersToUse.length; i++) {
  //   await borrowUntilUndercollateralized(usersToUse, i, lendingPool);
  // }
  for (let i = 0; i < 10; i++) {
    queue.add(() => borrowUntilUndercollateralized(api, usersToUse, i, lendingPool));
  }

  queue.start();
  await queue.onIdle();

  console.log('Finish');
  await api.disconnect();
  process.exit(0);
})(getArgvObj()).catch((e) => {
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});

async function borrowUntilUndercollateralized(
  api: ApiPromise,
  usersToUse: { pair: KeyringPair; mnemonic: string }[],
  i: number,
  lendingPool: LendingPool,
) {
  const user = usersToUse[i];
  if (i % 50 === 0) console.log(new Date(), 'Borrow until undercollateralized', `${i} users done`);
  const userSignedLendingPool = lendingPool.withSigner(user.pair);
  const {
    value: { ok: initialCollateralCoeffRes },
  } = await userSignedLendingPool.query.getUserFreeCollateralCoefficient(user.pair.address);
  let collateralCoefficient = initialCollateralCoeffRes![1].rawNumber;

  while (collateralCoefficient && collateralCoefficient.gtn(55_000)) {
    if (collateralCoefficient.divRound(new BN(200_000)).gtn(0))
      console.log(new Date(), user.pair.address, 'Above 200_000', `Current value: ${collateralCoefficient.toString()}`);
    else if (collateralCoefficient.divRound(new BN(150_000)).gtn(0))
      console.log(new Date(), user.pair.address, 'Above 150_000', `Current value: ${collateralCoefficient.toString()}`);
    else if (collateralCoefficient.divRound(new BN(100_000)).gtn(0))
      console.log(new Date(), user.pair.address, 'Above 100_000', `Current value: ${collateralCoefficient.toString()}`);
    const {
      value: { ok: collateralCoeffRes },
    } = await userSignedLendingPool.query.getUserFreeCollateralCoefficient(user.pair.address);

    if (collateralCoeffRes && collateralCoeffRes[1].rawNumber.gtn(0)) {
      collateralCoefficient = collateralCoeffRes[1].rawNumber;
      try {
        const testUSDC = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'), user.pair, api);
        const testDOT = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'), user.pair, api);
        const testEth = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'), user.pair, api);
        const testAzero = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'), user.pair, api);
        const usdcRes = await userSignedLendingPool.query.borrow(
          testUSDC.address,
          user.pair.address,
          convertToCurrencyDecimalsStatic('USDC_TEST', 1),
          [],
        );
        try {
          usdcRes.value.unwrapRecursively();
          await userSignedLendingPool.tx.borrow(testUSDC.address, user.pair.address, convertToCurrencyDecimalsStatic('USDC_TEST', 1), []);
        } catch (e) {
          console.error(new Date(), `usdcRes`, `user no. ${i} (${user.pair.address})`, e);
        }
        const dotRes = await userSignedLendingPool.query.borrow(testDOT.address, user.pair.address, 100, []);
        try {
          dotRes.value.unwrapRecursively();
          await userSignedLendingPool.tx.borrow(testDOT.address, user.pair.address, 100, []);
        } catch (e) {
          console.error(new Date(), `dotRes`, `user no. ${i} (${user.pair.address})`, e);
        }
        const ethBorrowRes = await userSignedLendingPool.query.borrow(
          testEth.address,
          user.pair.address,
          convertToCurrencyDecimalsStatic('WETH_TEST', 0.5),
          [],
        );
        try {
          ethBorrowRes.value.unwrapRecursively();
          await userSignedLendingPool.tx.borrow(testEth.address, user.pair.address, convertToCurrencyDecimalsStatic('WETH_TEST', 0.05), []);
        } catch (e) {
          console.error(new Date(), `ethBorrowRes`, `user no. ${i} (${user.pair.address})`, e);
        }
        const btcRes = await userSignedLendingPool.query.borrow(
          testAzero.address,
          user.pair.address,
          convertToCurrencyDecimalsStatic('BTC_TEST', 0.0001),
          [],
        );
        try {
          btcRes.value.unwrapRecursively();
          await userSignedLendingPool.tx.borrow(testAzero.address, user.pair.address, convertToCurrencyDecimalsStatic('BTC_TEST', 0.0001), []);
        } catch (e) {
          console.error(new Date(), `btcRes`, `user no. ${i} (${user.pair.address})`, e);
        }
      } catch (e) {
        console.error(new Date(), `user no. ${i} (${user.pair.address})`, e);
      }
    } else {
      if (process.env.DEBUG) console.log(new Date(), `user no. ${i} (${user.pair.address}) has not yet performed supply`);
    }
  }
  console.warn(new Date(), user.pair.address, 'Finish', `Current value: ${collateralCoefficient.toString()}`);
}
