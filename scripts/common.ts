import { ApiProviderWrapper } from 'wookashwackomytest-contract-helpers';

export const apiProviderWrapper = new ApiProviderWrapper(process.env.WS_ENDPOINT ?? 'ws://127.0.0.1:9944');
