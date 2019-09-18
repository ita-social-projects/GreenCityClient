import {MapBounds} from './map/map-bounds';
import {FilterDiscountDtoModel} from './filter-discount-dto.model';
import {FilterDistanceDto} from './filter-distance-dto.model';


export class FilterPlaceDtoModel {

  constructor(mapBoundsDto: MapBounds, discountDto: FilterDiscountDtoModel, distanceFromUserDto: FilterDistanceDto) {
    this.mapBoundsDto = mapBoundsDto;
    this.discountDto = discountDto;
    this.distanceFromUserDto = distanceFromUserDto;
  }

  mapBoundsDto: MapBounds;
  discountDto: FilterDiscountDtoModel;
  distanceFromUserDto: FilterDistanceDto;
}
