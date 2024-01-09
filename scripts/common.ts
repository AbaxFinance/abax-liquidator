import { ApiProviderWrapper } from '@abaxfinance/contract-helpers';

export const apiProviderWrapper = new ApiProviderWrapper(process.env.RPC_ENDPOINT ?? 'ws://127.0.0.1:9944');
