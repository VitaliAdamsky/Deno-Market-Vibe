import { FundingRateData } from "../models/fr-data.ts";

export class FundingRateDataRepo {
  private static data: FundingRateData[] = [];
  private static url = "";
  private static initialized = false;

  public static async initialize(url: string): Promise<void> {
    if (FundingRateDataRepo.initialized) return;

    FundingRateDataRepo.url = url;
    await FundingRateDataRepo.fetchAndStore();
    FundingRateDataRepo.initialized = true;
  }

  private static async fetchAndStore(): Promise<void> {
    try {
      const response = await fetch(FundingRateDataRepo.url);
      if (!response.ok) {
        console.error(
          "Failed to fetch funding rate data:",
          response.statusText
        );
        return;
      }

      const json = await response.json();
      const data: FundingRateData[] = json.data || [];
      FundingRateDataRepo.data = data;
    } catch (err) {
      console.error("Error fetching funding rate data:", err);
    }
  }

  public static async renew(): Promise<void> {
    await FundingRateDataRepo.fetchAndStore();
  }

  public static getData(): FundingRateData[] {
    if (!FundingRateDataRepo.initialized) {
      throw new Error(
        "FundingRateDataRepo not initialized. Call initialize() first."
      );
    }
    return FundingRateDataRepo.data;
  }
}
