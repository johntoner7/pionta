export interface PintLog {
  id: number;
  pintName: string;
  barName: string;
  rating?: number;
  description?: string;
  createdAt?: Date;
  price?: number;
}

export interface PintLogRequest {
  pintName: string;
  barId: number;
  rating?: number;
  description?: string;
  createdAt?: Date;
  price?: number;
}