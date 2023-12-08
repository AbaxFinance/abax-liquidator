import { getContractObject } from '@abaxfinance/contract-helpers';
import { U128_MAX_VALUE, convertToCurrencyDecimalsStatic, getArgvObj, toE12 } from '@abaxfinance/utils';
import { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import BN from 'bn.js';
import chalk from 'chalk';
import fs from 'fs-extra';
import { isEqual, isNil } from 'lodash';
import PQueue from 'p-queue';
import path from 'path';
import { LendingPool } from '@abaxfinance/contract-helpers';
import { Psp22Ownable, TestReservesMinter, TestReservesMinterErrorBuilder } from '@abaxfinance/contract-helpers';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { apiProviderWrapper } from 'scripts/common';
import { LENDING_POOL_ADDRESS, TEST_RESERVES_MINTER_ADDRESS } from '@src/utils';
import { deployedContractsGetters } from '@src/deployedContracts';
import { nobody } from '@polkadot/keyring/pair/nobody';
import { supplyNativeTAZEROBalance } from '@scripts/fundWalletWithTestTokens';

const SAFE_ONE_TIME_APPROVAL_AMOUNT = U128_MAX_VALUE.divn(1_000);

export function getRandomSigner(keyring: Keyring) {
  const mnemonic = mnemonicGenerate();
  const pair = keyring.addFromUri(mnemonic, {}, 'sr25519');

  return { pair, mnemonic };
}

export type StoredUser = {
  pair: KeyringPair;
  mnemonic: string;
};

export const usersPath = path.join(path.parse(__filename).dir, 'users.json');
export const getStoredUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersPath, 'utf8')) as Omit<StoredUser, 'pair'>[]; // returning pair is unsafe as keyring pair does not get serialized properly
  } catch (e) {
    console.warn(`Unable to retrieve previous users `);
    return [];
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

  const signerFromSeed = keyring.createFromUri(seed, {}, 'sr25519');

  const signerNobody = nobody();

  const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signerNobody, api);

  const storedUsers = getStoredUsers();
  const shouldInitializeUsers = storedUsers.length === 0;
  if (shouldInitializeUsers) console.log('generating users...');
  const usersToUse = shouldInitializeUsers
    ? Array(1_000)
        .fill(null)
        .map(() => getRandomSigner(keyring))
    : storedUsers.map((su) => ({ mnemonic: su.mnemonic, pair: keyring.addFromUri(su.mnemonic, {}, 'sr25519') }));

  fs.writeFileSync(usersPath, JSON.stringify(usersToUse), 'utf-8');

  for (let i = 0; i < usersToUse.length; i++) {
    await supplyNativeTAZEROBalance(usersToUse, i, api, signerFromSeed);
  }
  // for (let i = 0; i < usersToUse.length; i++) {
  //   queue.add(() => supplyNativeTAZEROBalance(usersToUse, i, api, signer));
  // }
  // queue.start();
  // await queue.onIdle();

  const queue = new PQueue({ concurrency: 25, autoStart: false });
  const testReservesMinter = getContractObject(TestReservesMinter, TEST_RESERVES_MINTER_ADDRESS, signerNobody, api);
  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => mintTestTokensForUser(usersToUse, i, testReservesMinter));
  }
  queue.start();
  await queue.onIdle();

  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => approveSupplyAndBorrow(api, usersToUse, i, lendingPool));
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

async function mintTestTokensForUser(usersToUse: { pair: KeyringPair; mnemonic: string }[], i: number, testReservesMinter: TestReservesMinter) {
  const amountsToMint = [
    [
      deployedContractsGetters.getReserveUnderlyingAddress('AZERO_TEST'),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['AZERO_TEST'])).muln(100_000),
    ],
    [
      deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['BTC_TEST'])).muln(5),
    ],
    [
      deployedContractsGetters.getReserveUnderlyingAddress('USDC_TEST'),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['USDC_TEST'])).muln(100_000),
    ],
    [
      deployedContractsGetters.getReserveUnderlyingAddress('DAI_TEST'),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DAI_TEST'])).muln(100_000),
    ],
    [
      deployedContractsGetters.getReserveUnderlyingAddress('DOT_TEST'),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DOT_TEST'])).muln(20_000),
    ],
    [
      deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['WETH_TEST'])).muln(50),
    ],
  ] satisfies Parameters<typeof testReservesMinter.query.mint>['0'];

  const user = usersToUse[i];
  if (i % 50 === 0) console.log(new Date(), 'mint tokens', `${i} users done`);

  const userSignedTestReservesMinter = testReservesMinter.withSigner(user.pair);
  const queryRes = await userSignedTestReservesMinter.query.mint(amountsToMint as any, user.pair.address);
  if (isNil(queryRes.value.ok?.err)) {
    await userSignedTestReservesMinter.tx.mint(amountsToMint as any, user.pair.address);
  } else if (!isEqual(queryRes.value.ok?.err, TestReservesMinterErrorBuilder.AlreadyMinted())) {
    console.log('mint tokens', `error occured for user: ${user.pair.address}`, queryRes.value.ok?.err);
  }
}

async function approveSupplyAndBorrow(api: ApiPromise, usersToUse: { pair: KeyringPair; mnemonic: string }[], i: number, lendingPool: LendingPool) {
  const user = usersToUse[i];
  if (i % 50 === 0) console.log(new Date(), 'Approve & Supply & Borrow', `${i} users done`);
  const userSignedLendingPool = lendingPool.withSigner(user.pair);

  const {
    value: { ok: collateralCoeffRes },
  } = await userSignedLendingPool.query.getUserFreeCollateralCoefficient(user.pair.address);

  if (!collateralCoeffRes || collateralCoeffRes[1].rawNumber.eqn(0)) {
    try {
      const testEth = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'), user.pair, api);
      const testAzero = getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('AZERO_TEST'), user.pair, api);
      (await testEth.query.approve(lendingPool.address, SAFE_ONE_TIME_APPROVAL_AMOUNT)).value.unwrapRecursively();
      await testEth.tx.approve(lendingPool.address, SAFE_ONE_TIME_APPROVAL_AMOUNT);
      (await testAzero.query.approve(lendingPool.address, SAFE_ONE_TIME_APPROVAL_AMOUNT)).value.unwrapRecursively();
      await testAzero.tx.approve(lendingPool.address, SAFE_ONE_TIME_APPROVAL_AMOUNT);
      (
        await userSignedLendingPool.query.deposit(testEth.address, user.pair.address, convertToCurrencyDecimalsStatic('WETH_TEST', 30), [])
      ).value.unwrapRecursively();
      await userSignedLendingPool.tx.deposit(testEth.address, user.pair.address, convertToCurrencyDecimalsStatic('WETH_TEST', 30), []);
      (
        await userSignedLendingPool.query.deposit(testAzero.address, user.pair.address, convertToCurrencyDecimalsStatic('AZERO_TEST', 60_000), [])
      ).value.unwrapRecursively();
      await userSignedLendingPool.tx.deposit(testAzero.address, user.pair.address, convertToCurrencyDecimalsStatic('AZERO_TEST', 60000), []);
      (await userSignedLendingPool.query.setAsCollateral(testEth.address, true)).value.unwrapRecursively();
      await userSignedLendingPool.tx.setAsCollateral(testEth.address, true);
      (await userSignedLendingPool.query.setAsCollateral(testAzero.address, true)).value.unwrapRecursively();
      await userSignedLendingPool.tx.setAsCollateral(testAzero.address, true);
      (
        await userSignedLendingPool.query.borrow(testEth.address, user.pair.address, convertToCurrencyDecimalsStatic('WETH_TEST', 20), [])
      ).value.unwrapRecursively();
      await userSignedLendingPool.tx.borrow(testEth.address, user.pair.address, convertToCurrencyDecimalsStatic('WETH_TEST', 20), []);
      (
        await userSignedLendingPool.query.borrow(testAzero.address, user.pair.address, convertToCurrencyDecimalsStatic('AZERO_TEST', 30_000), [])
      ).value.unwrapRecursively();
      await userSignedLendingPool.tx.borrow(testAzero.address, user.pair.address, convertToCurrencyDecimalsStatic('AZERO_TEST', 30000), []);
    } catch (e) {
      console.error(new Date(), `user no. ${i} (${user.pair.address})`, e);
    }
  } else {
    if (process.env.DEBUG) console.log(new Date(), `user no. ${i} (${user.pair.address}) already performed actions`);
  }
}
