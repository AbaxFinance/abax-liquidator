import { ApiPromise, WsProvider } from '@polkadot/api';

export class ApiProviderWrapper {
  private api: ApiPromise | null;
  private wsProvider: WsProvider | null;
  private readonly webSocketEndpoint: string;

  constructor(webSocketEndpoint: string) {
    this.api = null;
    this.wsProvider = null;
    this.webSocketEndpoint = webSocketEndpoint;
  }

  getNotConnected = async () => {
    await this.closeApi();
    this.wsProvider = new WsProvider(this.webSocketEndpoint);
    this.api = new ApiPromise({ provider: this.wsProvider });

    return this.api;
  };

  getAndWaitForReady = async (useCache: boolean = true) => {
    if (!useCache || !this.wsProvider) {
      await this.wsProvider?.disconnect();
      this.wsProvider = null;
      this.wsProvider = new WsProvider(this.webSocketEndpoint);
    }
    if (!useCache || !this.api) {
      const newApi = await ApiPromise.create({ provider: this.wsProvider, noInitWarn: true, throwOnConnect: true });
      await newApi.isReady;
      await this.api?.disconnect();
      this.api = null;
      this.api = newApi;
    }

    await this.api.isReady;
    return this.api;
  };

  getAndWaitForReadyNoCache = async () => {
    const wsProvider = new WsProvider(this.webSocketEndpoint);
    const newApi = await ApiPromise.create({ provider: wsProvider, noInitWarn: true, throwOnConnect: true });
    await newApi.isReady;
    return newApi;
  };

  closeApi = async () => {
    await this.api?.disconnect();
    await this.wsProvider?.disconnect();
    this.wsProvider = null;
    this.api = null;
  };
}

export const sleep = (waitTimeInMs: any) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

export const apiProviderWrapper = new ApiProviderWrapper(process.env.WS_ENDPOINT ?? 'ws://127.0.0.1:9944');
