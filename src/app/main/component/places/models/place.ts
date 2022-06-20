import { PlaceLocation } from './location.model';
export class Place {
  id: number;
  name: string;
  location: PlaceLocation;
  favorite?: boolean;
}

export interface FilterPlaceCategories {
  id: number;
  name: string;
  nameUa: string;
}
