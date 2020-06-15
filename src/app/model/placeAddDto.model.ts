import { LocationDto } from './locationDto.model';
import { CategoryDto } from './category.model';
import { OpeningHours } from './openingHours.model';
import { DiscountDto } from './discount/DiscountDto';
import { Photo } from './photo/photo';

export class PlaceAddDto {
  name: string;
  category: CategoryDto;
  location: LocationDto;
  openingHoursList: OpeningHours[];
  discountValues: DiscountDto[];
  photos: Photo[];
}
