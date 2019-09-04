import {Category} from '../category/category.model';
import {OpenHours} from '../openHours/open-hours.model';
import {User} from '../user/user.model';
import {Location} from '../location/location';

export class AdminPlace {
  id: number;
  name: string;
  location: Location;
  category: Category;
  author: User;
  openingHoursList: Array<OpenHours>;
  modifiedDate: string;
  status: string;
}
