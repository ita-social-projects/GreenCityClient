import {CategoryDto} from "../../../model/category.model";
import {LocationDto} from "../../../model/locationDto.model";
import {OpeningHours} from "../../../model/openingHours.model";
import {DiscountDto} from "../../../model/discount/DiscountDto";
import {Photo} from "../../../model/photo/photo";

export class PlaceUpdatedDto {
  id: number;
  name: string;
  category: CategoryDto;
  location: LocationDto;
  openingHoursList: OpeningHours[];
  discountValues: DiscountDto[];
}
