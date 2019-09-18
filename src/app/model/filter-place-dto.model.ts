import {MapBounds} from './map/map-bounds';
import {FilterDiscountDtoModel} from './filter-discount-dto.model';
import {PlaceStatus} from './placeStatus.model';

export class FilterPlaceDtoModel {

  constructor(mapBoundsDto: MapBounds, discountDto: FilterDiscountDtoModel, searchReg: string, status: PlaceStatus) {
    this.mapBoundsDto = mapBoundsDto;
    this.discountDto = discountDto;
    this.searchReg = searchReg;
    this.status = status;
  }

  mapBoundsDto: MapBounds;
  discountDto: FilterDiscountDtoModel;
  status: PlaceStatus;
  searchReg: string;
}
