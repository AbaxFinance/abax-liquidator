// HF priorities:

import { ONE_MINUTE } from 'src/constants';

// ```
// (0.00, 1.05]    0 critical 5   min interval
// (1.05, 1.20]    1 high     10  min interval
// (1.20, 1.50]    2 medium   15  min interval
// (1.50, 2.00]    3 low      30  min interval
// (2.00,  inf]    4 safe     120 min interval
// ```

export const getUpdateIntervalByHFPriority = (hfPriority: number) => {
  switch (hfPriority) {
    case 0:
      return 5 * ONE_MINUTE;
    case 1:
      return 10 * ONE_MINUTE;
    case 2:
      return 15 * ONE_MINUTE;
    case 3:
      return 30 * ONE_MINUTE;
    default:
      return 120 * ONE_MINUTE;
  }
};
