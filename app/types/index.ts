export type UseCase = 'gaming' | 'camera' | 'social' | 'basic' | 'tough';
export type KeepDuration = 'short' | 'mid' | 'long';
export type Condition = 'new' | 'open' | 'pref';
export type StockStatus = 'in' | 'limited' | 'second';
export type Language = 'en' | 'id';
export type Theme = 'light' | 'dark';

export interface PhoneSpecs {
  chipset: string;
  ram: string;
  storage: string;
  battery_mah: string;
  main_camera_mp: string;
  antutu: string;
  display: string;
}

export interface Phone {
  id: string;
  name: string;
  tags?: UseCase[];
  price_idr: [number, number];
  specs: PhoneSpecs;
  youtube_url: string;
  youtube_channel: string;
  stock: StockStatus;
}

export interface Alternate {
  id: string;
  name: string;
  price_idr: [number, number];
  better_at: string;
  trade_off: string;
}

export interface UserInput {
  budget: number;
  brand: string;
  use: UseCase | '';
  keep: KeepDuration | '';
  condition: Condition | '';
}

export interface Recommendation {
  primary: Phone & { reasons: string[] };
  alternates: [Alternate, Alternate];
}

export interface RecommendationError {
  error: 'service_unavailable' | 'api_key_missing' | string;
}
