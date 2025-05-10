import { TelegramBot } from "https://deno.land/x/telegram_bot_api@0.4.0/mod.ts";

import { logger } from "./logger.ts";
import { DColors } from "../models/colors.ts";

export class TelegramBotOperator {
  private static techBot: TelegramBot | null = null;
  private static businessBot: TelegramBot | null = null;

  /**
   * Initialize the Telegram bots with the provided configuration.
   * @param config - The application configuration containing bot tokens.
   */
  public static async initialize(config: {
    tgTech: string;
    tgBusiness: string;
  }) {
    try {
      // Validate bot tokens before initialization
      if (!config.tgTech || !config.tgBusiness) {
        throw new Error("Missing required bot tokens in configuration.");
      }
      // Mimicing asyn method
      await Promise.resolve();
      // Initialize bots only if validation succeeds
      this.techBot = new TelegramBot(config.tgTech);
      this.businessBot = new TelegramBot(config.tgBusiness);

      logger.info("TelegramBotOperator ---> initialized...", DColors.yellow);
    } catch (error) {
      logger.error("Failed to initialize Telegram bots:", error);
      throw error; // Rethrow the error to prevent further execution
    }
  }

  /**
   * Get the technical Telegram bot instance.
   * @returns The technical Telegram bot instance.
   */
  public static getTechBot(): TelegramBot {
    if (!this.techBot) {
      throw new Error("Tech bot is not initialized. Call initialize() first.");
    }
    return this.techBot;
  }

  /**
   * Get the business Telegram bot instance.
   * @returns The business Telegram bot instance.
   */
  public static getBusinessBot(): TelegramBot {
    if (!this.businessBot) {
      throw new Error(
        "Business bot is not initialized. Call initialize() first."
      );
    }
    return this.businessBot;
  }
}
