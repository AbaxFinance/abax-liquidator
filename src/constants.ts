export const ONE_SECOND = 1000;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ONE_MINUTE = ONE_SECOND * 60;
export enum HF_PRIORITY {
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  SAFE = 4,
}

export const UPDATE_INTERVAL_BY_HF_PRIORITY = {
  [HF_PRIORITY.CRITICAL]: 1 * ONE_MINUTE,
  [HF_PRIORITY.HIGH]: 3 * ONE_MINUTE,
  [HF_PRIORITY.MEDIUM]: 5 * ONE_MINUTE,
  [HF_PRIORITY.LOW]: 15 * ONE_MINUTE,
  [HF_PRIORITY.SAFE]: 120 * ONE_MINUTE,
};

export const HF_RANGE_BY_HF_PRIORITY = {
  [HF_PRIORITY.CRITICAL]: [0.0, 1.05] as const,
  [HF_PRIORITY.HIGH]: [1.05, 1.2] as const,
  [HF_PRIORITY.MEDIUM]: [1.2, 1.5] as const,
  [HF_PRIORITY.LOW]: [1.5, 2.0] as const,
  [HF_PRIORITY.SAFE]: [2.0, Number.MAX_SAFE_INTEGER] as const,
};
