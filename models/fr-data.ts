// models/funding-rate-data.ts

export interface FundingRateDataItem {
  openTime: number;
  closeTime: number;
  fundingRate: number;
  fundingRateChange: number | null;
  colors: {
    fundingRate: string;
    fundingRateChange: string;
  };
}

export interface FundingRateData {
  symbol: string;
  exchanges: string[];
  imageUrl: string;
  category: string;
  data: FundingRateDataItem[];
}
