import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DistanceFilter, MoreOptionsFormValue } from '../../models/more-options-filter.model';

@Component({
  selector: 'app-more-options-filter',
  templateUrl: './more-options-filter.component.html',
  styleUrls: ['./more-options-filter.component.scss']
})
export class MoreOptionsFilterComponent implements OnInit, OnChanges {
  @Input() public value: MoreOptionsFormValue;
  @Output() public filtersChange: EventEmitter<MoreOptionsFormValue> = new EventEmitter<MoreOptionsFormValue>();
  public baseFilters: string[] = ['Open now', 'Saved places', 'Special offers'];
  public distanceFilter: DistanceFilter = { isActive: false, value: null };
  public servicesFilters: string[] = [
    'Shops',
    'Restaurants',
    'Events',
    'Recycling points',
    'Vegan products',
    'Bike rentals',
    'Bike parking',
    'Hotels',
    'Charging station',
    'Cycling routes'
  ];

  public filtersForm: UntypedFormGroup = new UntypedFormGroup({
    baseFilters: new UntypedFormGroup(
      this.baseFilters.reduce((filters: any, filterName: string) => {
        filters[filterName] = new UntypedFormControl(false);
        return filters;
      }, {})
    ),
    distance: new UntypedFormGroup({
      isActive: new UntypedFormControl(false),
      value: new UntypedFormControl(5)
    }),
    servicesFilters: new UntypedFormGroup(
      this.servicesFilters.reduce((filters: any, filterName: string) => {
        filters[filterName] = new UntypedFormControl(false);
        return filters;
      }, {})
    )
  });

  public isActiveFilter = false;

  private suppressNextEmit = false;

  ngOnInit(): void {
    this.filtersForm.valueChanges.subscribe((formValue: MoreOptionsFormValue) => {
      if (this.suppressNextEmit) {
        this.suppressNextEmit = false;
        return;
      }
      this.filtersChange.emit(formValue);
      this.updateIsActiveFilter(formValue);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value?.currentValue) {
      if (!changes.value.firstChange) {
        this.suppressNextEmit = true;
      }
      this.filtersForm.setValue(this.value);
      this.updateIsActiveFilter(this.value);
    }
  }

  public updateIsActiveFilter(formValue: MoreOptionsFormValue): void {
    const isBaseFilter: boolean = Object.values(formValue.baseFilters).includes(true);
    const isServicesFilter: boolean = Object.values(formValue.servicesFilters).includes(true);
    this.isActiveFilter = isBaseFilter || isServicesFilter || formValue.distance.isActive;
  }
}
