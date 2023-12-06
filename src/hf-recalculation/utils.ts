import { HF_RANGE_BY_HF_PRIORITY, HF_PRIORITY } from '@src/constants';
import { logger } from '@src/logger';
import { enumKeys } from '@src/utils';

export function getHFPriority(healthFactor: number): HF_PRIORITY {
  for (const priority of enumKeys(HF_RANGE_BY_HF_PRIORITY)) {
    const range = HF_RANGE_BY_HF_PRIORITY[priority];
    const [min, max] = range;

    if (healthFactor >= min && healthFactor < max) {
      return priority;
    }
  }

  logger.error(`Could not determine hf update priority: ${healthFactor}`);
  return HF_PRIORITY.CRITICAL;
}
