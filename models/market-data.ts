import { KlineData } from "./kline-data.ts";
import { TF } from "./timeframes.ts";
import { OpenInterestData } from "./oi-data.ts";
import { FundingRateData } from "./fr-data.ts";

export interface MarketData {
  timeframe: TF;
  expirationTime: number;
  data: KlineData[] | OpenInterestData[] | FundingRateData[];
}
