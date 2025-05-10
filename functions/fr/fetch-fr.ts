import { MarketData } from "./../../models/market-data";
import { FundingRateData } from "./../../models/fr";
// deno-lint-ignore-file no-explicit-any no-explicit-any

import { constructUrlWithParams } from "../../grant-utils/functions/utils/construct-url-with-params.ts";
import { delay } from "../../grant-utils/functions/utils/delay.ts";
import { getFnName } from "../../grant-utils/functions/utils/get-fn-name.ts";
import { ServantsConfigOperator } from "../../grant-utils/servants/operators/servants-config-operator.ts";
import { sendErrorReport } from "../../grant-utils/tg/notifications/send-error-report.ts";

export async function fetchFr(
  limit: number,
  delayInMinutes: number
): Promise<FundingRateData[]> {
  const config = ServantsConfigOperator.getConfig();

  const baseUrl = config.proxyMarketVibe + "/api/norm/fr";

  const url = constructUrlWithParams(baseUrl, {
    limit: limit.toString(),
  });

  try {
    // Delay execution for the specified number of minutes
    await delay(delayInMinutes);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()).data as FundingRateData[];

    return data;
  } catch (error: any) {
    // Handle any errors that occur during the fetch operation
    console.error("An error occurred while fetching the kline data:", error);
    try {
      await sendErrorReport(config.projectName, getFnName(), error.message);
    } catch (error) {
      console.error("Failed to send tg error report:", error);
    }

    throw error; // Re-throw the error if you want calling code to handle it
  }
}
