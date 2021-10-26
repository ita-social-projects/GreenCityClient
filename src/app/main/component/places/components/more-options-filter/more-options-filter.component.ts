import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-more-options-filter',
  templateUrl: './more-options-filter.component.html',
  styleUrls: ['./more-options-filter.component.scss']
})
export class MoreOptionsFilterComponent implements OnInit {
  public baseFilters: string[] = ['Open now', 'Saved places', 'Special offers'];
  public distanceFilter: any = { isActive: false, value: null };
  public servicesFilters: string[] = [
    'Shops',
    'Restaurants',
    'Events',
    'Recycling points',
    'Saved Places',
    'Vegan products',
    'Bike rentals',
    'Bike parking',
    'Hotels',
    'Charging station',
    'Cycling routes'
  ];
  public value = 5;

  public filtersForm: FormGroup = new FormGroup({
    baseFilters: new FormGroup(
      this.baseFilters.reduce((filters: any, filterName: string) => {
        filters[filterName] = new FormControl(false);
        return filters;
      }, {})
    ),
    distance: new FormGroup({
      isActive: new FormControl(false),
      value: new FormControl(null)
    }),
    servicesFilters: new FormGroup(
      this.servicesFilters.reduce((filters: any, filterName: string) => {
        filters[filterName] = new FormControl(false);
        return filters;
      }, {})
    )
  });

  public isActiveFilter = false;

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe((formValue: any) => {
      console.log(formValue);
      this.updateIsActiveFilter(formValue);
    });
  }

  public updateIsActiveFilter(formValue: any): void {
    const isBaseFilter: boolean = Object.values(formValue.baseFilters).includes(true);
    const isServicesFilter: boolean = Object.values(formValue.servicesFilters).includes(true);
    this.isActiveFilter = isBaseFilter || isServicesFilter || formValue.distance.isActive;
  }
}
