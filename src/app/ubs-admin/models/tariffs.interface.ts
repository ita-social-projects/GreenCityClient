export interface Bag {
  name: string;
  capacity: number;
  price: number;
  commission: number;
  description: string;
  languageId?: 1;
  id?: number;
  fullPrice?: number;
  languageCode?: string;
  quantity?: number;
  langCode?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Service {
  price: number;
  capacity?: number;
  commission: number;
  description: string;
  name: string;
  languageCode?: string;
  id?: number;
  fullPrice?: number;
}
