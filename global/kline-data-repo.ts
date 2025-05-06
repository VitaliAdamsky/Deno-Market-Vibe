import { KlineData } from "../models/kline-data.ts";
import { TF } from "../models/timeframes.ts";

export class KlineDataRepo {
  private static timeframes: TF[] = [TF.h1, TF.h4, TF.D];
  private static dataMap: Map<TF, KlineData[]> = new Map();
  private static urlMap: Map<TF, string> = new Map();
  private static initialized = false;

  public static async initialize(
    urlMap: Partial<Record<TF, string>>
  ): Promise<void> {
    if (KlineDataRepo.initialized) return;

    KlineDataRepo.urlMap = new Map(Object.entries(urlMap) as [TF, string][]);
    await KlineDataRepo.fetchAllTimeframes();
    KlineDataRepo.initialized = true;
  }

  private static async fetchAllTimeframes(): Promise<void> {
    await Promise.all(
      KlineDataRepo.timeframes.map((tf) => KlineDataRepo.fetchAndStore(tf))
    );
  }

  private static async fetchAndStore(timeframe: TF): Promise<void> {
    const url = KlineDataRepo.urlMap.get(timeframe);
    if (!url) return;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Failed to fetch ${timeframe} data:`,
          response.statusText
        );
        return;
      }

      const json = await response.json();
      const data: KlineData[] = json.data || [];
      KlineDataRepo.dataMap.set(timeframe, data);
    } catch (err) {
      console.error(`Error fetching ${timeframe} data:`, err);
    }
  }

  public static async renew(timeframe: TF): Promise<void> {
    await KlineDataRepo.fetchAndStore(timeframe);
  }

  public static getData(timeframe: TF): KlineData[] {
    if (!KlineDataRepo.initialized) {
      throw new Error(
        "KlineDataRepo not initialized. Call initialize() first."
      );
    }
    return KlineDataRepo.dataMap.get(timeframe) ?? [];
  }
}
