import { OpenInterestDataStore } from "../global/oi-data-store.ts";
import { logger } from "../grant-utils/servants/operators/logger.ts";

export async function initializeOpenInterestStore() {
  try {
    await OpenInterestDataStore.initialize();
  } catch (error) {
    logger.error("Failed to initialize OpenInterestDataRepo:", error);
    throw error;
  }
}
