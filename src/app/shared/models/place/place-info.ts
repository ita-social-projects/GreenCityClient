import { Location } from './location';
import { OpeningHours } from '../openingHours.model';
import { CommentDto } from './commentDto';
import { DiscountDto } from '../DiscountDto';

export class PlaceInfo {
  id: number;
  name: string;
  location: Location;
  openingHoursList: OpeningHours[];
  discountValues: DiscountDto[];
  comments: CommentDto[];
  rate: number;
}
