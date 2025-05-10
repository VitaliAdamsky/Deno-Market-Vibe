import { AuthOperator } from "../servants/operators/auth-operator.ts";
import { ServantsConfigOperator } from "../servants/operators/servants-config-operator.ts";
import { TelegramBotOperator } from "../servants/operators/tg-bot-operator.ts";

export async function initializeServantsOperators() {
  try {
    await ServantsConfigOperator.initialize();
  } catch (error) {
    console.error("Failed to initialize ServantsConfigOperator:", error);
    throw error; // Re-throw the error if you want to handle it further up the call stack
  }

  let config;
  try {
    config = ServantsConfigOperator.getConfig();
  } catch (error) {
    console.error("Failed to get config from ServantsConfigOperator:", error);
    throw error;
  }

  try {
    await AuthOperator.initialize(config);
  } catch (error) {
    console.error("Failed to initialize AuthOperator:", error);
    throw error;
  }

  try {
    await TelegramBotOperator.initialize(config);
  } catch (error) {
    console.error("Failed to initialize TelegramBotOperator:", error);
    throw error;
  }
}
