import {Location} from '../location/location';

export class Place {
  id: number;
  name: string;
  location: Location;
  isFavorite = false;
}
