import { getContractObject } from '@abaxfinance/contract-helpers';
import { convertToCurrencyDecimalsStatic, getArgvObj } from '@abaxfinance/utils';
import { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import BN from 'bn.js';
import chalk from 'chalk';
import fs from 'fs-extra';
import PQueue from 'p-queue';
import path from 'path';
import { apiProviderWrapper } from 'scripts/common';
import { LendingPool } from '@abaxfinance/contract-helpers';
import { Psp22Ownable } from '@abaxfinance/contract-helpers';
import { LENDING_POOL_ADDRESS } from '@src/utils';

type StoredUser = {
  pair: KeyringPair;
  mnemonic: string;
};

const usersPath = path.join(path.parse(__filename).dir, 'users.json');
export const getStoredUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersPath, 'utf8')) as Omit<StoredUser, 'pair'>[]; // returning pair is unsafe as keyring pair does not get serialized properly
  } catch (e) {
    throw new Error(`Unable to retrieve previous users `);
  }
};
export const SUPPORTED_CURRENCIES_SYMBOLS = ['DAI_TEST', 'AZERO_TEST', 'USDC_TEST', 'WETH_TEST', 'DOT_TEST', 'BTC_TEST'] as const;
export type SUPPORTED_CURRENCIES_TYPE = (typeof SUPPORTED_CURRENCIES_SYMBOLS)[number];

export const SUPPORTED_CURRENCIES_DECIMALS = {
  DAI_TEST: 6,
  AZERO_TEST: 12,
  USDC_TEST: 6,
  WETH_TEST: 18,
  DOT_TEST: 12,
  BTC_TEST: 8,
} as Record<SUPPORTED_CURRENCIES_TYPE, number>;

const reserveDatas: Record<SUPPORTED_CURRENCIES_TYPE, string> = {
  DAI_TEST: '5DDyvXWoxRKX1PpwHcFkUnZX9MwPmHbWU17SPZ2AKFgAVjya',
  USDC_TEST: '5G8Jpgj7dZoP5wuMgTHdBPUWTmZaYaEyvaYurJpgVb1ki3ky',
  WETH_TEST: '5CVxZjK7WQCcjmgGZA35pTqyXr1cvvEe22nrz6wSTcsW1nTv',
  BTC_TEST: '5GRu3YzEN9YBrcB9EaqiGpKpjwW9HmuwSAbDdeCw4v69sn6C',
  AZERO_TEST: '5DRWtNpAKukhyTHzEfkk7PjLQZq9E7CcArc8bGkLx9AE3Z5p',
  DOT_TEST: '5ELWMYwQSgmKLYJhu5WigEZA5t6Y7QZ8w4dzeFkawU436LJ9',
};

export const convertNumberOrStringToBN = (amount: BN | number | string) => {
  try {
    return new BN(amount);
  } catch {
    return new BN(amount.toString());
  }
};
const keyring = new Keyring();
(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const seed = process.env.SEED;
  if (!seed) throw 'could not determine seed';
  const api = await apiProviderWrapper.getAndWaitForReady();

  const signer = keyring.createFromUri(seed, {}, 'sr25519');
  const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);

  const storedUsers = getStoredUsers();
  const usersToUse = storedUsers.map((su) => ({ mnemonic: su.mnemonic, pair: keyring.addFromUri(su.mnemonic, {}, 'sr25519') }));

  const queue = new PQueue({ concurrency: 40, autoStart: false });

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
        const testUSDC = getContractObject(Psp22Ownable, reserveDatas.WETH_TEST, user.pair, api);
        const testDOT = getContractObject(Psp22Ownable, reserveDatas.BTC_TEST, user.pair, api);
        const testEth = getContractObject(Psp22Ownable, reserveDatas.WETH_TEST, user.pair, api);
        const testAzero = getContractObject(Psp22Ownable, reserveDatas.BTC_TEST, user.pair, api);
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
