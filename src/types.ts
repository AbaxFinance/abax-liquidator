import type { BlockHash } from '@polkadot/types/interfaces/chain';
import { Abi } from '@polkadot/api-contract';
export type EventsFromBlockResult = {
  blockTimestamp: string;
  blockNumber: number;
  eventsByContractAddress: Record<string, EventWithMeta[]>;
  error?: Error;
  blockHash: BlockHash;
};

export type EventWithMeta = {
  event: any;
  meta: {
    contractAddress: string;
    contractName: string;
    timestamp: string;
    timestampISO: string;
    eventName: string;
    blockNumber: number;
    blockHash: string;
  };
};

export interface IWithAddress {
  address: string;
}

export interface IWithAbi {
  abi: Abi;
}
