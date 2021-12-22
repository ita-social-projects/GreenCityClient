import { PlaceLocation } from './location.model';
export class Place {
  id: number;
  name: string;
  location: PlaceLocation;
  favorite?: boolean;
}
