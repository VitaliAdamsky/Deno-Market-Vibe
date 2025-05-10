import { TF } from "../../models/timeframes.ts";

export const bybitKlineInterval = (timeframe: TF): string => {
  const bybitKlineIntervalMap: Record<TF, string> = {
    [TF.m1]: "1",
    [TF.m5]: "5",
    [TF.m15]: "15",
    [TF.m30]: "30",
    [TF.h1]: "60",
    [TF.h2]: "120",
    [TF.h4]: "240",
    [TF.h6]: "360",
    [TF.h8]: "480",
    [TF.h12]: "720",
    [TF.D]: "1d",
  };
  const interval = bybitKlineIntervalMap[timeframe];
  if (interval === undefined) {
    throw new Error(`Unsupported timeframe for Bybit Kline: ${timeframe}`);
  }
  return interval;
};
