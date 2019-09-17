import {MapBounds} from './map/map-bounds';
import {FilterDiscountDtoModel} from './filter-discount-dto.model';

export class FilterPlaceDtoModel {

  constructor(mapBoundsDto: MapBounds, discountDto: FilterDiscountDtoModel) {
    this.mapBoundsDto = mapBoundsDto;
    this.discountDto = discountDto;
  }

  mapBoundsDto: MapBounds;
  discountDto: FilterDiscountDtoModel;
}
