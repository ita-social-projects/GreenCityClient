import { Category } from '../../../model/category/category.model';
import { OpenHours } from '../../../model/openHours/open-hours.model';
import { User } from '../../../model/user/user.model';
import { Location } from '../../../model/location/location';

export class AdminPlace {
  id: number;
  name: string;
  location: Location;
  category: Category;
  author: User;
  openingHoursList: Array<OpenHours>;
  modifiedDate: string;
  status: string;
  isSelected: boolean;
}
