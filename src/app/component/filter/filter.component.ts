import {Component} from '@angular/core';
import {Options} from 'ng5-slider';
import {PlaceService} from '../../service/place/place.service';
import {MapComponent} from '../user/map/map.component';
import {FilterPlaceDtoModel} from '../../model/filtering/filter-place-dto.model';
import {FilterDiscountDtoModel} from '../../model/filtering/filter-discount-dto.model';
import {PlaceStatus} from '../../model/placeStatus.model';
import {FilterPlaceService} from '../../service/filtering/filter-place.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  filterDto: FilterPlaceDtoModel;
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
    const discount = new FilterDiscountDtoModel(
      this.mapComponent.category,
      this.mapComponent.specification,
      this.filterService.discountMin,
      this.filterService.discountMax);
    console.log(this.options.floor);
    this.filterDto = new FilterPlaceDtoModel(PlaceStatus.APPROVED, this.mapComponent.mapBounds, discount);
    this.placeService.getFilteredPlaces(this.filterDto).subscribe((res) => this.mapComponent.place = res);
  }
}
