// deno-lint-ignore-file no-explicit-any
import { constructUrlWithParams } from "../../grant-utils/functions/utils/construct-url-with-params.ts";
import { getFnName } from "../../grant-utils/functions/utils/get-fn-name.ts";
import { TF } from "../../grant-utils/models/timeframes.ts";
import { ServantsConfigOperator } from "../../grant-utils/servants/operators/servants-config-operator.ts";
import { sendErrorReport } from "../../grant-utils/tg/notifications/send-error-report.ts";
import { KlineData } from "../../models/kline.ts";

export async function fetchMinorKline(
  timeframe: TF,
  limit: number
): Promise<KlineData[]> {
  const config = ServantsConfigOperator.getConfig();

  const baseUrl = config.proxyMarketVibe + "/api/norm/kline";
  const url = constructUrlWithParams(baseUrl, {
    timeframe,
    limit: limit.toString(),
  });
  console.log(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()).data as KlineData[];

    return data;
  } catch (error: any) {
    console.error("An error occurred while fetching the kline data:", error);

    try {
      await sendErrorReport(config.projectName, getFnName(), error.message);
    } catch (error) {
      console.error("Failed to send tg error report:", error);
    }

    throw error;
  }
}
