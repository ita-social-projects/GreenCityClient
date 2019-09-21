import {Injectable} from '@angular/core';
import {MapBounds} from '../../model/map/map-bounds';
import {CategoryDto} from '../../model/category.model';
import {Specification} from '../../model/specification/specification';
import {LatLngBounds} from '@agm/core';
import {FilterDiscountDtoModel} from '../../model/filtering/filter-discount-dto.model';
import {FilterPlaceDtoModel} from '../../model/filtering/filter-place-dto.model';
import {PlaceStatus} from '../../model/placeStatus.model';

@Injectable({
  providedIn: 'root'
})
export class FilterPlaceService {
  isCleared = true;
  mapBounds = new MapBounds();
  category: CategoryDto;
  specification: Specification;
  isNowOpen: boolean;
  discountMin = 0;
  discountMax = 100;

  setCategoryName(name: string) {
    this.category = new CategoryDto();
    this.category.name = name;
  }

  setSpecName(name: string) {
    this.specification = new Specification();
    this.specification.name = name;
  }

  setMapBounds(latLngBounds: LatLngBounds) {
    this.mapBounds.northEastLat = latLngBounds.getNorthEast().lat();
    this.mapBounds.northEastLng = latLngBounds.getNorthEast().lng();
    this.mapBounds.southWestLat = latLngBounds.getSouthWest().lat();
    this.mapBounds.southWestLng = latLngBounds.getSouthWest().lng();
  }

  setDiscountBounds(discountMin: number, discountMax: number) {
    this.discountMin = discountMin;
    this.discountMax = discountMax;
    this.isCleared = false;
  }

  getFilters() {
    const discount = new FilterDiscountDtoModel(this.category, this.specification, this.discountMin, this.discountMax);
    return new FilterPlaceDtoModel(PlaceStatus.APPROVED, this.mapBounds, discount, null);
  }

  clearDiscountRate() {
    this.discountMin = 0;
    this.discountMax = 100;
    this.isCleared = true;
  }
}
