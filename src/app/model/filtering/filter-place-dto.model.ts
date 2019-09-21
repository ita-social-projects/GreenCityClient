import {MapBounds} from '../map/map-bounds';
import {FilterDiscountDtoModel} from './filter-discount-dto.model';
import {PlaceStatus} from '../placeStatus.model';

export class FilterPlaceDtoModel {

  constructor(status: PlaceStatus, mapBoundsDto: MapBounds, discountDto: FilterDiscountDtoModel, searchReg: string) {
    this.status = status;
    this.mapBoundsDto = mapBoundsDto;
    this.discountDto = discountDto;
    this.searchReg = searchReg;
  }

  status: PlaceStatus;
  mapBoundsDto: MapBounds;
  discountDto: FilterDiscountDtoModel;
  searchReg: string;
}
