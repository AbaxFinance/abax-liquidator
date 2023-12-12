import { Psp22Ownable, TestReservesMinter, TestReservesMinterErrorBuilder, getContractObject } from '@abaxfinance/contract-helpers';
import { getArgvObj, toE12 } from '@abaxfinance/utils';
import type { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { apiProviderWrapper } from '@scripts/common';
import { SUPPORTED_CURRENCIES_DECIMALS, convertNumberOrStringToBN, getRandomSigner } from '@scripts/supplyAndBorrow1000Users';
import chalk from 'chalk';
import { isEqual, isNil } from 'lodash';
import PQueue from 'p-queue';
import { deployedContractsGetters } from '../src/deployedContracts';

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
  const usersToUse = Array(100)
    .fill(null)
    .map(() => getRandomSigner(keyring));

  const queue = new PQueue({ concurrency: 1, autoStart: false });
  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => supplyNativeTAZEROBalance(usersToUse, i, api, signer));
  }
  queue.start();
  await queue.onIdle();

  const testReservesMinter = getContractObject(TestReservesMinter, deployedContractsGetters.getAddress('test_reserves_minter'), signer, api);

  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => mintTestTokensForUser(usersToUse, i, testReservesMinter));
  }
  queue.start();
  await queue.onIdle();

  const targetAddress = signer.address;
  for (let i = 0; i < usersToUse.length; i++) {
    queue.add(() => fundWallet(usersToUse, i, targetAddress));
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
export async function supplyNativeTAZEROBalance(
  usersToUse: { pair: KeyringPair; mnemonic: string }[],
  i: number,
  api: ApiPromise,
  sender: KeyringPair,
) {
  const receiver = usersToUse[i];
  if (i % 50 === 0 && i !== 0) console.log(new Date(), 'Transfer TAZERO', `${i} users done analyzing balances`);

  const result = (await api.query.system.account(receiver.pair.address)) as any;
  const balanceRaw = result.data.free.toBigInt();
  const balanceReservedRaw = result.data.reserved.toBigInt();
  const balanceTotalRaw: bigint = balanceRaw + balanceReservedRaw;
  if (balanceTotalRaw === 0n) {
    await new Promise((resolve, reject) => {
      api.tx.balances
        .transferKeepAlive(receiver.pair.address, toE12(10))
        .signAndSend(sender, (currentResult) => {
          const { status } = currentResult;
          if (status.isInBlock) {
            // console.log(`Completed at block hash #${status.asInBlock.toString()}`);
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

  const userSignedTestReservesMinter = testReservesMinter.withSigner(user.pair);
  const queryRes = await userSignedTestReservesMinter.query.mint(amountsToMint as any, user.pair.address);
  if (isNil(queryRes.value.ok?.err)) {
    await userSignedTestReservesMinter.tx.mint(amountsToMint as any, user.pair.address);
  } else if (!isEqual(queryRes.value.ok?.err, TestReservesMinterErrorBuilder.AlreadyMinted())) {
    console.log('mint tokens', `error occured for user: ${user.pair.address}`, queryRes.value.ok?.err);
  }
}
async function fundWallet(usersToUse: { pair: KeyringPair; mnemonic: string }[], i: number, targetAddress: string) {
  const api = await apiProviderWrapper.getAndWaitForReady();
  const user = usersToUse[i];
  if (i % 50 === 0) console.log(new Date(), 'fund wallet', `${i} users done`);

  const tokensWithAmounts = [
    [
      getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('AZERO_TEST'), user.pair, api),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['AZERO_TEST'])).muln(100_000),
    ],
    [
      getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'), user.pair, api),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['BTC_TEST'])).muln(5),
    ],
    [
      getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('USDC_TEST'), user.pair, api),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['USDC_TEST'])).muln(100_000),
    ],
    [
      getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('DAI_TEST'), user.pair, api),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DAI_TEST'])).muln(100_000),
    ],
    [
      getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('DOT_TEST'), user.pair, api),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['DOT_TEST'])).muln(20_000),
    ],
    [
      getContractObject(Psp22Ownable, deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'), user.pair, api),
      convertNumberOrStringToBN(Math.pow(10, SUPPORTED_CURRENCIES_DECIMALS['WETH_TEST'])).muln(50),
    ],
  ] as const;

  for (const [contract, amount] of tokensWithAmounts) {
    try {
      await contract.tx.transfer(targetAddress, amount, []);
    } catch (e) {
      console.error(`transfer failed for user ${user.pair.address}`, e);
    }
  }
}
