import {Component, EventEmitter, Output} from '@angular/core';
import {Options} from 'ng5-slider';
import {PlaceService} from '../../service/place/place.service';
import {MapComponent} from '../user/map/map.component';
import {FilterDiscountDtoModel} from '../../model/filter-discount-dto.model';
import {FilterPlaceDtoModel} from '../../model/filter-place-dto.model';
import {FilterDistanceDto} from '../../model/filter-distance-dto.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  distance;
  @Output() filterDistanceChange = new EventEmitter();

  filter: FilterPlaceDtoModel;
  discountMin = 0;
  discountMax = 100;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    noSwitching: true
  };

  constructor(private placeService: PlaceService, private mapComponent: MapComponent) {
  }

  applyFilters() {
    console.log(this.mapComponent.category);
    console.log(this.mapComponent.specification);
    const discount = new FilterDiscountDtoModel(
      this.mapComponent.category, this.mapComponent.specification, this.discountMin, this.discountMax);

    const filterDistanceDto = new FilterDistanceDto(
      this.mapComponent.userMarkerLocation.lat,
      this.mapComponent.userMarkerLocation.lng,
      this.distance
    );
    this.filter = new FilterPlaceDtoModel(this.mapComponent.mapBounds, discount, filterDistanceDto);
    console.log(this.filter);
    this.placeService.getFilteredPlaces(this.filter).subscribe((res) => {
      this.mapComponent.place = res;
      if (this.distance) {
        this.filterDistanceChange.emit(this.distance);
      }

    });
  }
}
