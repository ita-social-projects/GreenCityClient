import { Component } from '@angular/core';
import { Options } from 'ng5-slider';
import { PlaceService } from '../../../service/place/place.service';
import { FilterPlaceService } from '../../../service/filtering/filter-place.service';
import { MapComponent } from '../map-component/map.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  discountMin = this.filterService.discountMin;
  discountMax = this.filterService.discountMax;
  isOpen = this.filterService.isNowOpen;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    noSwitching: true
  };
  distance: number;
  isDistanceValidationError = false;

  constructor(private placeService: PlaceService,
              private mapComponent: MapComponent,
              private filterService: FilterPlaceService) {
  }

  applyFilters() {
    this.isDistanceValidationError = false;
    if (this.distance != null) {
      if (this.distance <= 0) {
        this.isDistanceValidationError = true;
        return;
      }
    }
    this.filterService.setDiscountBounds(this.discountMin, this.discountMax);
    this.filterService.setIsNowOpen(this.isOpen);
    this.filterService.setDistance(this.distance);
    this.placeService.getFilteredPlaces();
    this.mapComponent.toggleFilter();
  }
}
