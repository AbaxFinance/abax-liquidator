import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiProviderWrapper } from './ApiProviderWrapper';
import { BN } from 'bn.js';

export const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

export const argvObj = process.argv.reduce((acc, val, index) => {
  const isSingleHyphenArg = val[0] === '-' && val[1] !== '-';
  const isDoubleHyphenArg = val.substring(0, 2) !== '--' && val[2] !== '-';
  const equalsPosition = val.indexOf('=');
  const isEqualsArg = equalsPosition !== -1;
  if (!isSingleHyphenArg && !isDoubleHyphenArg && !isEqualsArg) return acc;
  if (isEqualsArg) {
    acc[val.substring(0, equalsPosition)] = val.substring(equalsPosition + 1);
    return acc;
  }
  acc[isSingleHyphenArg ? val.substring(1) : val.substring(2)] = process.argv[index + 1];
  return acc;
}, {} as Record<string, string>);
export const getContractObject = async <T>(
  constructor: new (address: string, signer: KeyringPair, nativeAPI: ApiPromise) => T,
  contractAddress: string,
  signerPair: KeyringPair,
) => {
  return new constructor(contractAddress, signerPair, await apiProviderWrapper.getAndWaitForReady());
};
export const apiProviderWrapper = new ApiProviderWrapper(process.env.WS_ENDPOINT ?? 'ws://127.0.0.1:9944');

export const replaceRNBNPropsWithStrings = function (obj) {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj[key]?.rawNumber) {
        obj[key] = obj[key].rawNumber.toString();
      } else if (BN.isBN(obj[key])) {
        obj[key] = obj[key].toString();
      } else if (typeof obj[key] === 'object') {
        replaceRNBNPropsWithStrings(obj[key]);
      }
    }
  }
  return obj;
};
