import { handleEventReturn } from 'wookashwackomytest-typechain-types';
import {
  EVENT_DATA_TYPE_DESCRIPTIONS_A_TOKEN,
  EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL,
  EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_EMITABLE,
  EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_OWNABLE,
  EVENT_DATA_TYPE_DESCRIPTIONS_V_TOKEN,
  getEventTypeDescription,
} from 'wookashwackomytest-contract-helpers';
import { stringifyNumericProps } from '@c-forge/polkahat-chai-matchers';
import type { EventWithMeta, IWithAbi, IWithAddress } from '@src/types';

export function parseBlockEvents<TContract extends IWithAbi & IWithAddress>(
  eventsToParse: any,
  contracts: TContract[],
  timestamp: string,
  blockNumber: number,
  blockHash: string,
) {
  const eventsToReturnByContractAddress: Record<string, EventWithMeta[]> = {};
  for (const record of eventsToParse) {
    const { event } = record;

    if (record.name === 'Contracts.ContractEmitted' || event.method === 'ContractEmitted') {
      const address = record.args.contract ?? record.event.data[0];
      const data = record.args.data ?? record.event.data[1];

      for (const contract of contracts) {
        if (address.toString() !== contract.address.toString()) continue;
        const decodeEventResult = contract.abi.decodeEvent(data);
        const { args: eventArgs, event: ev } = decodeEventResult;

        const _event: Record<string, any> = {};
        for (let argI = 0; argI < eventArgs.length; argI++) {
          _event[ev.args[argI].name] = eventArgs[argI].toJSON();
        }
        const eventName = ev.identifier.toString();
        const contractName = contract.abi.info.contract.name.toString();

        const eventDataTypeDescriptionToUse = getEventDataTypeDescriptionToUse(contractName);
        const eventRet = handleEventReturn(_event, getEventTypeDescription(eventName, eventDataTypeDescriptionToUse));

        const eventRetWithMeta = {
          event: eventRet,
          meta: {
            contractName,
            contractAddress: address.toString() as string,
            eventName,
            timestamp: timestamp.toString(),
            timestampISO: new Date(parseInt(timestamp.toString())).toISOString(),
            blockNumber,
            blockHash: blockHash.toString(),
          },
        } satisfies EventWithMeta;
        eventsToReturnByContractAddress[eventRetWithMeta.meta.contractAddress] = [
          ...(eventsToReturnByContractAddress[eventRetWithMeta.meta.contractAddress] ?? []),
          stringifyNumericProps(eventRetWithMeta as any) as any,
        ];
      }
    }
  }
  return { blockTimestamp: timestamp, blockNumber, blockHash, eventsByContractAddress: eventsToReturnByContractAddress };
}

function getEventDataTypeDescriptionToUse(contractName: string) {
  switch (contractName) {
    case 'a_token':
      return EVENT_DATA_TYPE_DESCRIPTIONS_A_TOKEN;
    case 'v_token':
      return EVENT_DATA_TYPE_DESCRIPTIONS_V_TOKEN;
    case 'psp22_ownable':
      return EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_OWNABLE;
    case 'psp22_emitable':
      return EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_EMITABLE;
    default:
      return EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL;
  }
}
