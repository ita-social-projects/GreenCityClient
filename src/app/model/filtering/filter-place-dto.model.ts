import {MapBounds} from '../map/map-bounds';
import {FilterDiscountDtoModel} from './filter-discount-dto.model';
import {PlaceStatus} from '../placeStatus.model';

export class FilterPlaceDtoModel {

  constructor(status: PlaceStatus,
              mapBoundsDto: MapBounds,
              discountDto: FilterDiscountDtoModel,
              time: string) {
    this.status = status;
    this.mapBoundsDto = mapBoundsDto;
    this.discountDto = discountDto;
    this.time = time;
  }

  status: PlaceStatus;
  mapBoundsDto: MapBounds;
  discountDto: FilterDiscountDtoModel;
  time: string;
}
