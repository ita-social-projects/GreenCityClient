import {Component} from '@angular/core';
import {Options} from 'ng5-slider';
import {PlaceService} from '../../service/place/place.service';
import {MapComponent} from '../user/map/map.component';
import {FilterPlaceDtoModel} from '../../model/filtering/filter-place-dto.model';
import {FilterDiscountDtoModel} from '../../model/filtering/filter-discount-dto.model';
import {PlaceStatus} from '../../model/placeStatus.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
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
    const discount = new FilterDiscountDtoModel(
      this.mapComponent.category, this.mapComponent.specification, this.discountMin, this.discountMax);
    this.filter = new FilterPlaceDtoModel(PlaceStatus.APPROVED, this.mapComponent.mapBounds, discount);
    this.placeService.getFilteredPlaces(this.filter).subscribe((res) => this.mapComponent.place = res);
  }
}
