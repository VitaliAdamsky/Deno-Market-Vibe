// deno-lint-ignore-file no-explicit-any
import { fetchMinorKline } from "../functions/kline/fetch-minor-kline.ts";
import { saveErrorReport } from "../grant-utils/errors/save-error-report.ts";
import { getFnName } from "../grant-utils/functions/utils/get-fn-name.ts";

import { TF } from "../grant-utils/models/timeframes.ts";
import { DColors } from "../grant-utils/servants/models/colors.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { ServantsConfigOperator } from "../grant-utils/servants/operators/servants-config-operator.ts";
import { KlineData } from "../models/kline.ts";

export class KlineDataStore {
  private static limit: number = 53;
  private static data: Partial<Record<TF, KlineData[]>> = {};

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static async initialize(): Promise<void> {
    // Fetch and store data for each timeframe
    await KlineDataStore.updateData(TF.h1);
    await KlineDataStore.updateData(TF.h4);
    await KlineDataStore.updateData(TF.h12);
    await KlineDataStore.updateData(TF.D);

    logger.info("KlineDataStore ---> initialized...", DColors.cyan);
  }

  // public static async updateData(timeframe: TF): Promise<void> {
  //   const config = ServantsConfigOperator.getConfig();

  //   if (timeframe === TF.h12 || timeframe === TF.D) {
  //     KlineDataStore.data[timeframe] = await fetchMajorKLine(
  //       timeframe,
  //       KlineDataStore.limit,
  //       config.delayInMinutesShort
  //     );
  //   } else {
  //     KlineDataStore.data[timeframe] = await fetchMajorKLine(
  //       timeframe,
  //       KlineDataStore.limit,
  //       config.delayInMinutesLong
  //     );
  //   }
  // }

  public static async updateData(timeframe: TF): Promise<void> {
    try {
      KlineDataStore.data[timeframe] = await fetchMinorKline(
        timeframe,
        KlineDataStore.limit
      );
    } catch (error: any) {
      logger.error("Failed to update data:", error);

      try {
        const config = ServantsConfigOperator.getConfig();
        await saveErrorReport(config.projectName, getFnName(), error);
      } catch (error) {
        console.error("Failed to send tg error report:", error);
      }
      throw error;
    }
  }

  public static getData(timeframe: TF): KlineData[] {
    console.log(`Retrieving data for timeframe: ${timeframe}`);
    return KlineDataStore.data[timeframe] || [];
  }
}
