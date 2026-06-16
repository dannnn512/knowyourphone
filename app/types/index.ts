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
  battery: string;
  mainCameraMP: string;
  antutu: string;
  display: string;
}

export interface Phone {
  id: string;
  name: string;
  tags: UseCase[];
  price: [number, number];
  longevity: number;
  stock: StockStatus;
  enReasons: string[];
  idReasons: string[];
  specs: PhoneSpecs;
}

export interface UserInput {
  budget: number;
  use: UseCase | '';
  keep: KeepDuration | '';
  condition: Condition | '';
}

export interface Recommendation {
  primary: Phone;
  alts: [Phone, Phone];
}
