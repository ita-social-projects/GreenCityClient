import {Component} from '@angular/core';
import {Options} from 'ng5-slider';
import {PlaceService} from '../../service/place/place.service';
import {MapComponent} from '../user/map/map.component';
import {FilterDiscountDtoModel} from '../../model/filter-discount-dto.model';
import {FilterPlaceDtoModel} from '../../model/filter-place-dto.model';

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
  distanceOptions: Options;

  constructor(private placeService: PlaceService, private mapComponent: MapComponent) {
    /*this.calculateMinAndMaxDistance(mapComponent.place);*/
  }

  applyFilters() {
    console.log(this.mapComponent.category);
    console.log(this.mapComponent.specification);
    const discount = new FilterDiscountDtoModel(
      this.mapComponent.category, this.mapComponent.specification, this.discountMin, this.discountMax);
    this.filter = new FilterPlaceDtoModel(this.mapComponent.mapBounds, discount);
    console.log(this.filter);
    this.placeService.getFilteredPlaces(this.filter).subscribe((res) => this.mapComponent.place = res);
    this.mapComponent.isFilter = false;
  }

  /*calculateMinAndMaxDistance(place: Place[]) {
    let min = place[0] != null ? place[0].location.distanceFromUser : 0;
    let max = place[0] != null ? place[0].location.distanceFromUser : 0;
    place.forEach(p => {
      if (p.location.distanceFromUser < min) {
        min = p.location.distanceFromUser;
      }
      if (p.location.distanceFromUser > max) {
        max = p.location.distanceFromUser;
      }
    });

    this.distanceOptions = {
      floor: min,
      ceil: max,
      step: 1,
      noSwitching: true
    };
  }*/
}
