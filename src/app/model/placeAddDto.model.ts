import {PlaceStatus} from './placeStatus.model';
import {LocationDto} from './locationDto.model';
import {CategoryDto} from './category.model';
import {OpeningHours} from './openingHours.model';

export class PlaceAddDto {
  name: string;
  category: CategoryDto;
  location: LocationDto;
  openingHoursList: OpeningHours[];
}
