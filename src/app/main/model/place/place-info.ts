import { Location } from '../location/location';
import { OpeningHours } from '../openingHours.model';
import { CommentDto } from '../comment/commentDto';
import { DiscountDto } from '../discount/DiscountDto';

export class PlaceInfo {
  id: number;
  name: string;
  location: Location;
  openingHoursList: OpeningHours[];
  discountValues: DiscountDto[];
  comments: CommentDto[];
  rate: number;
}
