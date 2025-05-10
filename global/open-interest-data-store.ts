import { fetchMajorOi } from "../functions/oi/fetch-major-oi.ts";

import { TF } from "../grant-utils/models/timeframes.ts";
import { DColors } from "../grant-utils/servants/models/colors.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { ServantsConfigOperator } from "../grant-utils/servants/operators/servants-config-operator.ts";
import { OpentInterestData } from "../models/oi.ts";

export class OpenInterestDataStore {
  private static limit: number = 52;
  private static data: Partial<Record<TF, OpentInterestData[]>> = {};

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static async initialize(): Promise<void> {
    // Fetch and store data for each timeframe
    await OpenInterestDataStore.updateData(TF.h1);
    await OpenInterestDataStore.updateData(TF.h4);
    await OpenInterestDataStore.updateData(TF.h12);
    await OpenInterestDataStore.updateData(TF.D);

    logger.info("OpenInterestDataStore ---> initialized...", DColors.cyan);
  }

  public static async updateData(timeframe: TF): Promise<void> {
    const config = ServantsConfigOperator.getConfig();

    if (timeframe === TF.h12 || timeframe === TF.D) {
      OpenInterestDataStore.data[timeframe] = await fetchMajorOi(
        timeframe,
        OpenInterestDataStore.limit,
        config.delayInMinutesShort
      );
    } else {
      OpenInterestDataStore.data[timeframe] = await fetchMajorOi(
        timeframe,
        OpenInterestDataStore.limit,
        config.delayInMinutesLong
      );
    }
  }

  public static getData(timeframe: TF): OpentInterestData[] {
    console.log(`Retrieving data for timeframe: ${timeframe}`);
    return OpenInterestDataStore.data[timeframe] || [];
  }
}
