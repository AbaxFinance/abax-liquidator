export const ONE_SECOND = 1000;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ONE_MINUTE = ONE_SECOND * 60;
export enum HF_PRIORITY {
  CRITICAL = 0,
  VERY_HIGH = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  SAFE = 5,
  SAFEST = 6,
}
export const MARKET_RULE_IDS = [0, 1, 2] as const;

export const UPDATE_INTERVAL_BY_HF_PRIORITY = {
  [HF_PRIORITY.CRITICAL]: 5 * ONE_SECOND,
  [HF_PRIORITY.VERY_HIGH]: 10 * ONE_SECOND,
  [HF_PRIORITY.HIGH]: 30 * ONE_SECOND,
  [HF_PRIORITY.MEDIUM]: 1 * ONE_MINUTE,
  [HF_PRIORITY.LOW]: 5 * ONE_MINUTE,
  [HF_PRIORITY.SAFE]: 15 * ONE_MINUTE,
  [HF_PRIORITY.SAFEST]: 30 * ONE_MINUTE,
} satisfies Record<HF_PRIORITY, number>;

export const HF_RANGE_BY_HF_PRIORITY = {
  [HF_PRIORITY.CRITICAL]: [0.0, 1.05] as const,
  [HF_PRIORITY.VERY_HIGH]: [1.05, 1.1] as const,
  [HF_PRIORITY.HIGH]: [1.1, 1.5] as const,
  [HF_PRIORITY.MEDIUM]: [1.5, 1.8] as const,
  [HF_PRIORITY.LOW]: [1.8, 2.5] as const,
  [HF_PRIORITY.SAFE]: [2.5, 3.5] as const,
  [HF_PRIORITY.SAFEST]: [3.5, Number.MAX_SAFE_INTEGER] as const,
} satisfies Record<HF_PRIORITY, [number, number]>;
