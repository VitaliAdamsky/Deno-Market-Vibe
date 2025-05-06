import { OpenInterestData } from "../models/oi-data.ts";
import { TF } from "../models/timeframes.ts";

export class OpenInterestDataRepo {
  private static timeframes: TF[] = [TF.h1, TF.h4, TF.D];
  private static dataMap: Map<TF, OpenInterestData[]> = new Map();
  private static urlMap: Map<TF, string> = new Map();
  private static initialized = false;

  public static async initialize(
    urlMap: Partial<Record<TF, string>>
  ): Promise<void> {
    if (OpenInterestDataRepo.initialized) return;

    OpenInterestDataRepo.urlMap = new Map(
      Object.entries(urlMap) as [TF, string][]
    );
    await OpenInterestDataRepo.fetchAllTimeframes();
    OpenInterestDataRepo.initialized = true;
  }

  private static async fetchAllTimeframes(): Promise<void> {
    await Promise.all(
      OpenInterestDataRepo.timeframes.map((tf) =>
        OpenInterestDataRepo.fetchAndStore(tf)
      )
    );
  }

  private static async fetchAndStore(timeframe: TF): Promise<void> {
    const url = OpenInterestDataRepo.urlMap.get(timeframe);
    if (!url) return;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Failed to fetch Open Interest ${timeframe} data:`,
          response.statusText
        );
        return;
      }

      const json = await response.json();
      const data: OpenInterestData[] = json.data || [];
      OpenInterestDataRepo.dataMap.set(timeframe, data);
    } catch (err) {
      console.error(`Error fetching Open Interest ${timeframe} data:`, err);
    }
  }

  public static async renew(timeframe: TF): Promise<void> {
    await OpenInterestDataRepo.fetchAndStore(timeframe);
  }

  public static getData(timeframe: TF): OpenInterestData[] {
    if (!OpenInterestDataRepo.initialized) {
      throw new Error(
        "OpenInterestDataRepo not initialized. Call initialize() first."
      );
    }
    return OpenInterestDataRepo.dataMap.get(timeframe) ?? [];
  }
}
