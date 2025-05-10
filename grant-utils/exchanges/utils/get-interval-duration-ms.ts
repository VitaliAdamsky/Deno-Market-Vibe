import { TF } from "../../models/timeframes.ts";

export const getIntervalDurationMs = (timeframe: TF): number => {
  const mapping: Record<TF, number> = {
    [TF.m1]: 59999,
    [TF.m5]: 299999,
    [TF.m15]: 899999,
    [TF.m30]: 1799999,
    [TF.h1]: 3599999,
    [TF.h2]: 7199999,
    [TF.h4]: 14399999,
    [TF.h6]: 21599999,
    [TF.h8]: 28799999,
    [TF.h12]: 43199999,
    [TF.D]: 86399999,
  };

  if (!(timeframe in mapping)) {
    throw new Error(
      `getIntervalDurationMs: Unsupported timeframe key: ${timeframe}`
    );
  }

  return mapping[timeframe];
};
