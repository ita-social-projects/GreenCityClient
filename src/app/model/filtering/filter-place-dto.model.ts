import { MapBounds } from '../map/map-bounds';
import { FilterDiscountDtoModel } from './filter-discount-dto.model';
import { PlaceStatus } from '../placeStatus.model';
import { FilterDistanceDto } from './filter-distance-dto.model';

export class FilterPlaceDtoModel {
  status: PlaceStatus;
  mapBoundsDto: MapBounds;
  discountDto: FilterDiscountDtoModel;
  distanceFromUserDto: FilterDistanceDto;
  searchReg: string;
  time: string;

  constructor(
    status: PlaceStatus,
    mapBoundsDto: MapBounds,
    discountDto: FilterDiscountDtoModel,
    distanceFromUserDto: FilterDistanceDto,
    searchReg: string,
    time: string
  ) {
    this.status = status;
    this.mapBoundsDto = mapBoundsDto;
    this.discountDto = discountDto;
    this.distanceFromUserDto = distanceFromUserDto;
    this.searchReg = searchReg;
    this.time = time;
  }
}
