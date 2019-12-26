import {CategoryDto} from "../category.model";
import {LocationDto} from "../locationDto.model";
import {OpeningHours} from "../openingHours.model";
import {DiscountDto} from "../discount/DiscountDto";
import {Photo} from "../photo/photo";

export class PlaceUpdatedDto {
  id: number;
  name: string;
  category: CategoryDto;
  location: LocationDto;
  openingHoursList: OpeningHours[];
  discountValues: DiscountDto[];
}
