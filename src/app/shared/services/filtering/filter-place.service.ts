import { Injectable } from '@angular/core';
import { MapBounds } from '../../models/map/map-bounds';
import { CategoryDto } from '../../models/category.model';
import { Specification } from '../../models/specification/specification';
// import { LatLngBounds } from '@agm/core';
import { FilterDiscountDtoModel } from '../../models/filtering/filter-discount-dto.model';
import { FilterPlaceDtoModel } from '../../models/filtering/filter-place-dto.model';
import { PlaceStatus } from '../../models/placeStatus.model';
import { DatePipe } from '@angular/common';
import { FilterDistanceDto } from '../../models/filtering/filter-distance-dto.model';

import { BehaviorSubject } from 'rxjs';
import { PlaceLocation } from 'src/app/greencity/modules/places/models/location.model';
import { PlacesFilter } from 'src/app/greencity/modules/places/models/places-filter';

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
  distance: number;
  userMarkerLocation: PlaceLocation = new PlaceLocation();

  filtersDto$: BehaviorSubject<any> = new BehaviorSubject<any>({ status: PlaceStatus.APPROVED });
  isFavoriteFilter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private datePipe: DatePipe) {}

  setCategoryName(name: string) {
    this.category = new CategoryDto();
    this.category.name = name;
  }

  setSpecName(name: string) {
    this.specification = new Specification();
    this.specification.name = name;
  }

  // setMapBounds(latLngBounds: LatLngBounds) {
  //   this.mapBounds.northEastLat = latLngBounds.getNorthEast().lat();
  //   this.mapBounds.northEastLng = latLngBounds.getNorthEast().lng();
  //   this.mapBounds.southWestLat = latLngBounds.getSouthWest().lat();
  //   this.mapBounds.southWestLng = latLngBounds.getSouthWest().lng();
  // }

  setDiscountBounds(discountMin: number, discountMax: number) {
    this.discountMin = discountMin;
    this.discountMax = discountMax;
    this.isCleared = false;
  }

  setIsNowOpen(isOpen: boolean) {
    this.isNowOpen = isOpen;
  }

  getFilters() {
    const discount = new FilterDiscountDtoModel(this.category, this.specification, this.discountMin, this.discountMax);
    const currentTime = this.isNowOpen ? this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss') : null;
    const distance = new FilterDistanceDto(this.userMarkerLocation.lat, this.userMarkerLocation.lng, this.distance);
    return new FilterPlaceDtoModel(PlaceStatus.APPROVED, this.mapBounds, discount, distance, null, currentTime);
  }

  updateFiltersDto(placesFilter: PlacesFilter) {
    const filtersDto: any = {
      status: PlaceStatus.APPROVED,
      mapBoundsDto: placesFilter.mapBoundsDto
    };
    if (placesFilter.searchName) {
      filtersDto.searchReg = placesFilter.searchName;
    }

    if (placesFilter.moreOptionsFilters?.distance.isActive) {
      filtersDto.distanceFromUserDto = {
        distance: placesFilter.moreOptionsFilters.distance.value,
        lat: placesFilter.position.latitude,
        lng: placesFilter.position.longitude
      };
    }

    if (placesFilter.moreOptionsFilters?.baseFilters['Open now']) {
      filtersDto.time = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    }
    const servicesFilters = placesFilter.moreOptionsFilters?.servicesFilters;

    let categories = [];

    if (servicesFilters) {
      const services = Object.keys(servicesFilters).reduce((acc: string[], key: string) => {
        if (servicesFilters[key]) {
          acc.push(key);
        }
        return acc;
      }, []);
      categories.push(...services, ...placesFilter.basicFilters);
      categories = this.removeNonCategoryFilters(categories);
    }

    if (categories.length) {
      filtersDto.categories = categories;
    }

    const isFavoriteFilter: boolean =
      placesFilter.moreOptionsFilters?.baseFilters['Saved places'] || placesFilter.basicFilters.includes('Saved places');
    this.isFavoriteFilter$.next(isFavoriteFilter);

    this.filtersDto$.next(filtersDto);
  }

  private removeNonCategoryFilters(filters: string[]): string[] {
    return filters.filter((filterItem: string) => filterItem !== 'Saved places');
  }

  clearFilter() {
    this.discountMin = 0;
    this.discountMax = 100;
    this.isCleared = true;
    this.isNowOpen = false;
    this.distance = null;
  }

  setDistance(distance: number) {
    this.distance = distance > 0 ? distance : null;
  }

  setUserMarkerLocation(userMarkerLocation: PlaceLocation) {
    this.userMarkerLocation = userMarkerLocation;
  }
}
