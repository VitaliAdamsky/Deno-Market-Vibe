import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { ServantsConfig } from "../models/servants-config.ts";
import { DColors } from "../models/colors.ts";
import { logger } from "./logger.ts";

export class AuthOperator {
  private static dbClient: MongoClient | null = null;
  private static db: Database | null = null;
  private static readonly dbName = "auth";
  private static readonly collectionName = "whitelist";

  public static async initialize(config: ServantsConfig) {
    if (this.dbClient) return; // Prevent re-initialization
    try {
      const MONGO_DB_URI = config.mongoDb;

      if (!MONGO_DB_URI) {
        throw new Error("MongoDB URI is not defined in the environment.");
      }

      this.dbClient = new MongoClient();
      await this.dbClient.connect(MONGO_DB_URI);
      this.db = this.dbClient.database(this.dbName);
      logger.success("AuthOperator ---> initialized...", DColors.magenta);
    } catch (error) {
      console.error("Failed to initialize AuthOperator:", error);
      throw error;
    }
  }

  public static async isEmailWhitelisted(email: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error("Database not initialized. Call initialize() first.");
      }

      const whitelistCollection = this.db.collection(this.collectionName);
      const result = await whitelistCollection.findOne({ email });

      return !!result; // Returns true if the email exists in the whitelist
    } catch (error) {
      console.error("Error checking email whitelist:", error);
      throw new Error("Failed to check email whitelist.");
    }
  }

  public static async validateEmail(email: string) {
    try {
      const isWhitelisted = await this.isEmailWhitelisted(email);
      return { isWhitelisted };
    } catch (error) {
      logger.error("Email Validation failed:", error);
      throw error;
    }
  }
}
