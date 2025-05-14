import { KlineDataStore } from "../../global/kline-data-store.ts";
import { TF } from "../../grant-utils/models/timeframes.ts";
import { DColors } from "../../grant-utils/servants/models/colors.ts";
import { logger } from "../../grant-utils/servants/operators/logger.ts";
import { UnixToTime } from "../../grant-utils/servants/utils/time/time-converter.ts";

export async function runCronTask(timeframe: TF) {
  const currentTime = UnixToTime(new Date().getTime());
  logger.info(
    `⏳ Cron ${timeframe} Job is running at ${currentTime}...`,
    DColors.cyan
  );

  await KlineDataStore.updateData(timeframe);
}
