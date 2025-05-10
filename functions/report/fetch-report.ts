// deno-lint-ignore-file no-explicit-any
import { constructUrlWithParams } from "../../grant-utils/functions/utils/construct-url-with-params.ts";
import { TF } from "../../grant-utils/models/timeframes.ts";
import { ServantsConfigOperator } from "../../grant-utils/servants/operators/servants-config-operator.ts";
import { sendErrorReport } from "../../grant-utils/tg/notifications/send-error-report.ts";

const fnName = "fetchReport";

export async function fetchReport(timeframe: TF, limit: number) {
  const config = ServantsConfigOperator.getConfig();

  const baseUrl = config.proxyMarketVibe + "/api/report/kline";
  const url = constructUrlWithParams(baseUrl, {
    timeframe,
    limit: limit.toString(),
  });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    // Handle any errors that occur during the fetch operation
    console.error("An error occurred while fetching the report data:", error);
    try {
      await sendErrorReport(config.projectName, fnName, error.message);
    } catch (error) {
      console.error("Failed to send tg error report:", error);
    }
    throw error;
  }
}
