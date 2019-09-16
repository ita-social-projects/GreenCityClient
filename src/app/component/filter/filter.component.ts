import {Component} from '@angular/core';
import {Options} from 'ng5-slider';
import {PlaceService} from '../../service/place/place.service';
import {MapComponent} from '../user/map/map.component';
import {FilterDtoModel} from '../../model/filter-dto.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  filter: FilterDtoModel;
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
    this.filter = new FilterDtoModel(this.mapComponent.mapBounds, this.discountMin, this.discountMax);
    this.placeService.getFilteredPlaces(this.filter).subscribe((res) => this.mapComponent.place = res);
    this.mapComponent.isFilter = false;
  }
}
