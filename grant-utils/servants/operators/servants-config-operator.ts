// ConfigOperator.ts
import Doppler, { DownloadResponse } from "npm:@dopplerhq/node-sdk";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { logger } from "./logger.ts";
import { DColors } from "../models/colors.ts";
import { ServantsConfig } from "../models/servants-config.ts";

const env = await load();

export class ServantsConfigOperator {
  // Static instance of the class (Singleton pattern)
  private static instance: ServantsConfigOperator | null = null;
  private static dopplerToken: string | undefined = env["SERVANTS_TOKEN"];
  // Static in-memory data structure for Config
  private static config: ServantsConfig | null = null;

  // Private constructor to prevent direct instantiation [[1]]
  private constructor() {}

  // Method to get the Singleton instance
  public static getInstance(): ServantsConfigOperator {
    if (!ServantsConfigOperator.instance) {
      ServantsConfigOperator.instance = new ServantsConfigOperator();
    }
    return ServantsConfigOperator.instance;
  }

  // Initialize method to populate the static in-memory Config structure
  public static async initialize(): Promise<void> {
    if (ServantsConfigOperator.config) {
      logger.info("Configuration is already initialized.", DColors.yellow);
      return;
    }

    try {
      const doppler = new Doppler({
        accessToken: this.dopplerToken,
      });

      // Fetch secrets from Doppler
      const response = await doppler.secrets.download("servants", "prd");
      const secrets = response as DownloadResponse as Record<string, string>;

      // Populate the static in-memory Config structure
      ServantsConfigOperator.config = {
        tgUser: secrets["TG_USER"],
        tgTech: secrets["TG_TECH"],
        tgBusiness: secrets["TG_BUSINESS"] || "",
        allowedOrigins: JSON.parse(secrets["ALLOWED_ORIGINS"]),
        coinsApi: secrets["COINS"] || "",
        coinsStoreApi: secrets["COINS_STORE"] || "",
        mongoDb: secrets["MONGO_DB"] || "",
        proxyMarketVibe: secrets["PROXY_MARKET_VIBE"] || "",
        projectName: "Deno-Market-Vibe",
        delayInMinutesShort: 0,
        delayInMinutesLong: 10,
      };

      logger.info("ConfigOperator ---> initialized...", DColors.cyan);
    } catch (error) {
      logger.error("Failed to initialize configuration:", error);
      throw error;
    }
  }

  // Method to access the static in-memory Config structure
  public static getConfig(): ServantsConfig {
    if (!ServantsConfigOperator.config) {
      throw new Error(
        "Configuration is not initialized. Call initialize() first."
      );
    }
    return ServantsConfigOperator.config;
  }

  // Method to update the static in-memory Config structure
  public static async reloadConfig(): Promise<void> {
    if (!this.dopplerToken) {
      throw new Error(
        "Servants Token is required to reload the Servants Configuration."
      );
    }

    try {
      logger.info("Reloading configuration from Doppler...", DColors.cyan);
      await ServantsConfigOperator.initialize();
      logger.success(
        "Servant Configuration reloaded successfully.",
        DColors.green
      );
    } catch (error) {
      logger.error("Failed to reload Servant Configuration:", error);
      throw error;
    }
  }
}
