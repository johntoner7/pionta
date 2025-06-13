export interface PintPrice {
  id: number;
  name: string;
  price: number;
}

export interface Bar {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pintPrices: PintPrice[];
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  phone?: string;
  website?: string;
  rating?: number;
  photos?: string[];
  tags?: string[];
} 