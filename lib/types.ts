export type Aggregation = "raw" | "1m" | "5m" | "1h";

export interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
  min?: number;
  max?: number;
  count?: number;
}
