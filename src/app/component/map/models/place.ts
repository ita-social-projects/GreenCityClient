import {Location} from '../../../model/location/location';

export class Place {
  id: number;
  name: string;
  location: Location;
  favorite: boolean;
  color = 'star-yellow';
}
