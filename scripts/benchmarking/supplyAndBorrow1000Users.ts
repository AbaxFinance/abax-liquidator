import path from 'path';
import fs from 'fs-extra';
import Keyring from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import BN from 'bn.js';
import chalk from 'chalk';
import { apiProviderWrapper, argvObj, getContractObject } from 'scripts/common';
import { getPreviousEvents } from 'scripts/fetchEvents';
import LendingPool from 'typechain/contracts/lending_pool';
import TestReservesMinter from 'typechain/contracts/test_reserves_minter';
import PSP22Ownable from 'typechain/contracts/psp22_ownable';
import { TestReservesMinterErrorBuilder } from 'typechain/types-returns/test_reserves_minter';
import { isEqual, isNil, noConflict } from 'lodash';
import PQueue from 'p-queue';
function parseAmountToBN(amount: number | string) {
  const countDecimals = function (value: number | string) {
    const MAX_AMOUNT_OF_DECIMALS_JS_HANDLES = 17;
    if (!value.toString().includes('.')) return 0;
    const decimals = value.toString().split('.')[1].length || 0;
    if (decimals > MAX_AMOUNT_OF_DECIMALS_JS_HANDLES) throw 'number of decimals exceed the number that JS parseFloat can handle';
    return decimals;
  };
  const amountParsedFloat = parseFloat(amount.toString());
  if (isNaN(amountParsedFloat)) return { amountParsed: new BN(0), amountParsedDecimals: 0 };
  const amountParsedDecimals = countDecimals(amountParsedFloat);
  const amountParsed = convertNumberOrStringToBN(amountParsedFloat * Math.pow(10, amountParsedDecimals));
  return { amountParsed, amountParsedDecimals };
}

const convertToCurrencyDecimalsStatic = (symbol: SUPPORTED_CURRENCIES_TYPE, amount: BN | number | string): BN => {
  const decimals = SUPPORTED_CURRENCIES_DECIMALS[symbol];
  const { amountParsed, amountParsedDecimals } = BN.isBN(amount) ? { amountParsed: amount, amountParsedDecimals: 0 } : parseAmountToBN(amount);
  try {
    return amountParsed.mul(convertNumberOrStringToBN(Math.pow(10, decimals - amountParsedDecimals)));
  } catch {
    return amountParsed.mul(convertNumberOrStringToBN(Math.pow(10, decimals - amountParsedDecimals).toString()));
  }
};
export const U128_MAX_VALUE = new BN('340282366920938463463374607431768211455');
const SAFE_ONE_TIME_APPROVAL_AMOUNT = U128_MAX_VALUE.divn(1_000);

export function getRandomSigner(keyring: Keyring) {
  const mnemonic = mnemonicGenerate();
  const pair = keyring.addFromUri(mnemonic, {}, 'sr25519');

  //   console.log(`Generate random signer: ${pair.address}`);
  //   console.log(`Mnemonic: ${mnemonic}`);

  return { pair, mnemonic };
}

type StoredUser = {
  pair: KeyringPair;
  mnemonic: string;
};

type NumericArg = number | string | BN;
export const E12 = Math.pow(10, 12);
export const toE12 = (num: NumericArg) => (typeof num === 'number' ? num : BN.isBN(num) ? num.toNumber() : parseInt(num)) * E12;

const LENDING_POOL_ADDRESS = '5C9MoPeD8rEATyW77U6fmUcnzGpvoLvqQ9QTMiA9oByGwffx';

const TEST_RESERVES_MINTER = '5CkfnnGrZkatSe2Jnh5j74wrsvskHjQCiJ6Peq9ZoGKAtxX3';

const usersPath = path.join(path.parse(__filename).dir, 'users.json');
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

const amountsToMint = [
  [reserveDatas['AZERO_TEST'], convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['AZERO_TEST'])).muln(100_000)],
  [reserveDatas['BTC_TEST'], convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['BTC_TEST'])).muln(5)],
  [reserveDatas['USDC_TEST'], convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['USDC_TEST'])).muln(100_000)],
  [reserveDatas['DAI_TEST'], convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DAI_TEST'])).muln(100_000)],
  [reserveDatas['DOT_TEST'], convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DOT_TEST'])).muln(20_000)],
  [reserveDatas['WETH_TEST'], convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['WETH_TEST'])).muln(50)],
];

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
  const lendingPool = await getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer);

  const storedUsers = getStoredUsers();
  const shouldInitializeUsers = storedUsers.length === 0;
  if (shouldInitializeUsers) console.log('generating users...');
  const usersToUse = shouldInitializeUsers
    ? Array(1_000)
        .fill(null)
        .map(() => getRandomSigner(keyring))
    : storedUsers.map((su) => ({ mnemonic: su.mnemonic, pair: keyring.addFromUri(su.mnemonic, {}, 'sr25519') }));

  fs.writeFileSync(usersPath, JSON.stringify(usersToUse), 'utf-8');

  const queue = new PQueue({ concurrency: 40, autoStart: false });
  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => supplyNativeTAZEROBalance(usersToUse, i, api, signer));
  }
  queue.start();
  await queue.onIdle();

  const testReservesMinter = await getContractObject(TestReservesMinter, TEST_RESERVES_MINTER, signer);

  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => mintTestTokensForUser(usersToUse, i, testReservesMinter));
  }
  queue.start();
  await queue.onIdle();

  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => approveSupplyAndBorrow(usersToUse, i, lendingPool));
  }

  queue.start();
  await queue.onIdle();

  console.log('Finish');
  await api.disconnect();
  process.exit(0);
})(argvObj).catch((e) => {
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
async function supplyNativeTAZEROBalance(usersToUse: { pair: KeyringPair; mnemonic: string }[], i: number, api, signer: KeyringPair) {
  const user = usersToUse[i];
  if (i % 50 === 0) console.log(new Date(), 'Transfer TAZERO', `${i} users done analyzing balances`);

  const result = (await api.query.system.account(user.pair.address)) as any;
  const balanceRaw = result.data.free.toBigInt();
  const balanceReservedRaw = result.data.reserved.toBigInt();
  const balanceTotalRaw: bigint = balanceRaw + balanceReservedRaw;
  if (balanceTotalRaw === 0n) {
    await new Promise((resolve, reject) => {
      api.tx.balances
        .transfer(user.pair.address, toE12(10))
        .signAndSend(signer, (currentResult) => {
          const { status } = currentResult;
          if (status.isInBlock) {
            //   console.log(`Completed at block hash #${status.asInBlock.toString()}`);
            resolve('');
          } else {
            //   console.log(`Current status: ${status.type}`);
          }
        })
        .catch((error: any) => {
          console.log(':( transaction failed', error);
          reject('');
        });
    });
  }
}

async function mintTestTokensForUser(usersToUse: { pair: KeyringPair; mnemonic: string }[], i: number, testReservesMinter: TestReservesMinter) {
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

async function approveSupplyAndBorrow(usersToUse: { pair: KeyringPair; mnemonic: string }[], i: number, lendingPool: LendingPool) {
  const user = usersToUse[i];
  if (i % 50 === 0) console.log(new Date(), 'Approve & Supply & Borrow', `${i} users done`);
  const userSignedLendingPool = lendingPool.withSigner(user.pair);

  const {
    value: { ok: collateralCoeffRes },
  } = await userSignedLendingPool.query.getUserFreeCollateralCoefficient(user.pair.address);

  if (!collateralCoeffRes || collateralCoeffRes[1].rawNumber.eqn(0)) {
    try {
      const testEth = await getContractObject(PSP22Ownable, reserveDatas.WETH_TEST, user.pair);
      const testAzero = await getContractObject(PSP22Ownable, reserveDatas.AZERO_TEST, user.pair);
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
