import { UserForListDtoModel } from './UserForListDto.model';
import { CategoryDto } from './category.model';
import { LocationDto } from './locationDto.model';
import { OpeningHours } from './openingHours.model';

export class PlaceWithUserModel {
  name: string;
  category: CategoryDto;
  location: LocationDto;
  openingHoursList: OpeningHours[];
  author: UserForListDtoModel;
}
