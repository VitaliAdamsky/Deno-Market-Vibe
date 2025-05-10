import initializeApp from "./app/initialize-app.ts";
import { initializeServantsOperators } from "./grant-utils/functions/initialize-servants-operators.ts";
import { DColors } from "./grant-utils/servants/models/colors.ts";
import { logger } from "./grant-utils/servants/operators/logger.ts";
import { ServantsConfigOperator } from "./grant-utils/servants/operators/servants-config-operator.ts";

async function initializeApplication() {
  try {
    await initializeServantsOperators();
    const config = ServantsConfigOperator.getConfig();
    const app = await initializeApp(config);

    app.listen({ port: 80 }, "0.0.0.0", () => {
      logger.success("Server --> started...", DColors.green);
      // cron1hJob();
      // cron2hJob();
      // cron4hJob();
      // cronDJob();
    });
  } catch (error) {
    logger.error("Application initialization failed:", error);
    Deno.exit(1);
  }
}

initializeApplication();
