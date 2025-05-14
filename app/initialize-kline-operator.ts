import { KlineDataStore } from "../global/kline-data-store.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";

export async function initializeKlineDataStore() {
  try {
    await KlineDataStore.initialize();
  } catch (error) {
    logger.error("Failed to initialize OpenInterestDataRepo:", error);
    throw error;
  }
}
