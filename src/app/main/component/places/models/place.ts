import { Location } from './location.model';
export class Place {
  id: number;
  name: string;
  location: Location;
  favorite?: boolean;
}
