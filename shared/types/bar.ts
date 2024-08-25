import PintPrice from "./pintPrice";

export interface Bar {
  id: number;
  longitude: number;
  latitude: number;
  name: string;
  description: string;
  pintPrices: PintPrice[];
}

export interface NewBar {
  name: string;
  description: string;
  longitude: number;
  latitude: number;
}
