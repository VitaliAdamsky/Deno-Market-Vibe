// models/market-data.ts

export interface OpenInterestDataItem {
  openTime: number;
  symbol: string;
  openInterest: number;
  openInterestChange: number;
  colors: {
    openInterest: string;
    openInterestChange: string;
  };
}

export interface OpenInterestData {
  symbol: string;
  exchanges: string[];
  imageUrl: string;
  category: string;
  data: OpenInterestDataItem[];
}
