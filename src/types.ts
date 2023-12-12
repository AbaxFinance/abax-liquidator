import type { CompleteReserveData } from '@abaxfinance/contract-helpers';
import { Abi } from '@polkadot/api-contract';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
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

export type ReserveDataWithMetadata = Omit<CompleteReserveData, 'tokens'> & {
  id: number;
};

export type LiquidationRequestData = {
  userAddress: string;
  debtPower: string;
  biggestDebtData: {
    amountRawE6: string;
    underlyingAddress: string;
  };
  collateralPower: string;
  biggestCollateralData: {
    amountRawE6: string;
    underlyingAddress: string;
  };
};
