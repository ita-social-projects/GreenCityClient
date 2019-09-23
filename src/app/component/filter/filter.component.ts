import {Component} from '@angular/core';
import {Options} from 'ng5-slider';
import {PlaceService} from '../../service/place/place.service';
import {FilterPlaceService} from '../../service/filtering/filter-place.service';
import {MapComponent} from '../user/map/map.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  discountMin = this.filterService.discountMin;
  discountMax = this.filterService.discountMax;
  isOpen = false;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    noSwitching: true
  };

  constructor(private placeService: PlaceService,
              private mapComponent: MapComponent,
              private filterService: FilterPlaceService) {
  }

  applyFilters() {
    this.filterService.setDiscountBounds(this.discountMin, this.discountMax);
    this.filterService.setIsNowOpen(this.isOpen);
    this.placeService.getFilteredPlaces();
    this.mapComponent.toggleFilter();
  }
}
