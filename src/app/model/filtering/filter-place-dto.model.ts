import {MapBounds} from '../map/map-bounds';
import {FilterDiscountDtoModel} from './filter-discount-dto.model';
import {PlaceStatus} from '../placeStatus.model';

export class FilterPlaceDtoModel {

  constructor(status: PlaceStatus, mapBoundsDto: MapBounds, discountDto: FilterDiscountDtoModel) {
    this.status = status;
    this.mapBoundsDto = mapBoundsDto;
    this.discountDto = discountDto;
  }

  status: PlaceStatus;
  mapBoundsDto: MapBounds;
  discountDto: FilterDiscountDtoModel;
}
