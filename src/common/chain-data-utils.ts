import type { AccountId, BalanceViewer, CompleteReserveData, LendingPool, UserReserveData } from '@abaxfinance/contract-helpers';
import type { ProtocolUserDataReturnType } from '@src/chain-data-updater/userDataChainUpdater';
import type { ReserveDataWithMetadata } from '@src/types';

export async function queryProtocolReserveDatas(balanceViewer: BalanceViewer, reserveAddresses: string[]) {
  const reserveDatasRet = await Promise.all(
    reserveAddresses.map((addr) => balanceViewer.query.viewCompleteReserveData(addr).then((res) => [addr, res])),
  );
  const reserveDatasRetVal = reserveDatasRet.map((rt) => [rt[0], (rt[1] as any).value.unwrapRecursively()]) as [string, CompleteReserveData][];
  return reserveDatasRetVal.reduce(
    (acc, [addr, rd], i) => {
      acc[addr] = { ...rd, id: i };
      return acc;
    },
    {} as Record<string, ReserveDataWithMetadata>,
  );
}

export async function queryProtocolUserData(
  lendingPool: LendingPool,
  balanceViewer: BalanceViewer,
  userAddress: AccountId,
): Promise<ProtocolUserDataReturnType> {
  const [
    {
      value: { ok: userConfigRet },
    },
    {
      value: { ok: userReservesRet },
    },
  ] = await Promise.all([lendingPool.query.viewUserConfig(userAddress), balanceViewer.query.viewUserReserveDatas(null, userAddress)]);
  const userReserves = userReservesRet!.reduce(
    (acc, [reserveAddress, reserve]) => {
      acc[reserveAddress.toString()] = reserve;
      return acc;
    },
    {} as Record<string, UserReserveData>,
  );
  return {
    userConfig: userConfigRet!,
    userReserves,
    userAddress,
  };
}
