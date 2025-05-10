import { TF } from "../../../models/timeframes.ts";

export const bybitOiInterval = (timeframe: TF): string => {
  const bybitOiMap: Record<TF, string> = {
    [TF.m1]: "1min",
    [TF.m5]: "5min",
    [TF.m15]: "15min",
    [TF.m30]: "30min",
    [TF.h1]: "1h",
    [TF.h4]: "4h",
    [TF.h2]: "2h",
    [TF.h6]: "6h",
    [TF.h8]: "8h",
    [TF.h12]: "12h",
    [TF.D]: "1d",
  };

  const interval = bybitOiMap[timeframe];
  if (interval === undefined) {
    throw new Error(`Unsupported timeframe for Bybit OI: ${timeframe}`);
  }

  return interval;
};
