import initializeApp from "./app/initialize-app.ts";
import { initializeServantsOperators } from "./grant-utils/functions/initialize-servants-operators.ts";
import { DColors } from "./grant-utils/servants/models/colors.ts";
import { logger } from "./grant-utils/servants/operators/logger.ts";
import { ServantsConfigOperator } from "./grant-utils/servants/operators/servants-config-operator.ts";
import { initializeKlineDataStore } from "./app/initialize-kline-operator.ts";

import { runCronTask } from "./functions/cron/run-cron-task.ts";
import { TF } from "./grant-utils/models/timeframes.ts";

async function initializeApplication() {
  try {
    await initializeServantsOperators();
    const config = ServantsConfigOperator.getConfig();
    await initializeKlineDataStore();
    const app = await initializeApp(config);

    app.listen({ port: 80 }, "0.0.0.0", () => {
      logger.success("Server --> started...", DColors.green);
    });
  } catch (error) {
    logger.error("Application initialization failed:", error);
  }
}

initializeApplication();

Deno.cron("Handle 1h tasks", "0 * * * *", () => runCronTask(TF.h1));
Deno.cron("Handle 4h tasks", "0 0,4,8,12,16,20 * * *", () =>
  runCronTask(TF.h4)
);
Deno.cron("Handle 12h tasks", "0 0,12 * * *", () => runCronTask(TF.h12));
Deno.cron("Handle D tasks", "0 0 * * *", () => runCronTask(TF.D));
