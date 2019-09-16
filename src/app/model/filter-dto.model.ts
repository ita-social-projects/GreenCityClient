import {MapBounds} from './map/map-bounds';

export class FilterDtoModel {

  constructor(mapBoundsDto: MapBounds, discountMin: number, discountMax: number) {
    this.mapBoundsDto = mapBoundsDto;
    this.discountMin = discountMin;
    this.discountMax = discountMax;
  }

  mapBoundsDto: MapBounds;
  discountMin: number;
  discountMax: number;
}
