import { fetchFr } from "../functions/fr/fetch-fr.ts";
import { TF } from "../grant-utils/models/timeframes.ts";
import { DColors } from "../grant-utils/servants/models/colors.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";
import { ServantsConfigOperator } from "../grant-utils/servants/operators/servants-config-operator.ts";
import { FundingRateData } from "../models/fr.ts";

export class FundingRateDataStore {
  private static limit: number = 52;
  private static data: FundingRateData[] = [];

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static async initialize(): Promise<void> {
    const config = ServantsConfigOperator.getConfig();
    const delay = config.delayInMinutesLong;

    await FundingRateDataStore.updateData(delay);

    logger.info("FundingRateDataStore ---> initialized...", DColors.cyan);
  }

  public static async updateData(delayInMinutes: number): Promise<void> {
    try {
      FundingRateDataStore.data = await fetchFr(
        FundingRateDataStore.limit,
        delayInMinutes
      );
    } catch (error) {
      logger.error("Failed to update data:", error);
      throw error; // Re-throw the error if you want calling code to handle it
    }
  }

  public static getData(timeframe: TF): FundingRateData[] {
    logger.info(`Retrieving data for timeframe: ${timeframe}`, DColors.cyan);
    return FundingRateDataStore.data || [];
  }
}
