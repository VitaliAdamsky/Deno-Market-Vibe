// deno-lint-ignore-file no-explicit-any

import { constructUrlWithParams } from "../../grant-utils/functions/utils/construct-url-with-params.ts";
import { delay } from "../../grant-utils/functions/utils/delay.ts";
import { getFnName } from "../../grant-utils/functions/utils/get-fn-name.ts";
import { TF } from "../../grant-utils/models/timeframes.ts";
import { ServantsConfigOperator } from "../../grant-utils/servants/operators/servants-config-operator.ts";
import { sendErrorReport } from "../../grant-utils/tg/notifications/send-error-report.ts";
import { OpentInterestData } from "../../models/oi.ts";

export async function fetchMajorOi(
  timeframe: TF,
  limit: number,
  delayInMinutes: number
): Promise<OpentInterestData[]> {
  const config = ServantsConfigOperator.getConfig();

  const baseUrl = config.proxyMarketVibe + "/api/norm/oi";

  const url = constructUrlWithParams(baseUrl, {
    timeframe,
    limit: limit.toString(),
  });

  try {
    // Delay execution for the specified number of minutes
    await delay(delayInMinutes);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()).data as OpentInterestData[];

    return data;
  } catch (error: any) {
    // Handle any errors that occur during the fetch operation
    console.error(
      "An error occurred while fetching the open interest data:",
      error
    );
    try {
      await sendErrorReport(config.projectName, getFnName(), error.message);
    } catch (error) {
      console.error("Failed to send tg error report:", error);
    }
    throw error;
  }
}
