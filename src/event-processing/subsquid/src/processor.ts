import { assertNotNull } from '@subsquid/util-internal';
import { lookupArchive } from '@subsquid/archive-registry';

import type {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from '@subsquid/substrate-processor';
import { SubstrateBatchProcessor } from '@subsquid/substrate-processor';
import dotenv from 'dotenv';
import path from 'path';
import type { ReturnPromiseType } from '@abaxfinance/utils';

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '.env.local') });

export const getProcessor = async (contractAddress: string[]) => {
  return new SubstrateBatchProcessor()
    .setDataSource({
      // Lookup archive by the network name in Subsquid registry
      // See https://docs.subsquid.io/substrate-indexing/supported-networks/
      archive: lookupArchive('aleph-zero-testnet', { release: 'ArrowSquid' }),
      // Chain RPC endpoint is required on Substrate for metadata and real-time updates
      chain: {
        // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
        // https://docs.subsquid.io/deploy-squid/env-variables/
        url: assertNotNull(process.env.RPC_ENDPOINT),
        // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
        rateLimit: 10,
      },
    })
    .addContractsContractEmitted({
      contractAddress,
      extrinsic: true,
    })
    .setFields({
      block: {
        timestamp: true,
      },
      extrinsic: {
        hash: true,
      },
    })
    .setBlockRange({
      // genesis block happens to not have a timestamp, so it's easier
      // to start from 1 in cases when the deployment height is unknown
      from: 48505327,
    });
};

export type Fields = SubstrateBatchProcessorFields<ReturnPromiseType<typeof getProcessor>>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
