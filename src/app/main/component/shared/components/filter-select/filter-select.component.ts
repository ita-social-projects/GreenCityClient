import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterOptions, FilterSelect } from 'src/app/main/interface/filter-select.interface';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterSelectComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() filter: FilterSelect;
  @Input() resetAllEvent!: Observable<void>;
  @ViewChild('selectFilter') selectFilter: MatSelect;
  @ViewChild('selectLabel') selectLabel: ElementRef;
  @Output() selectedList = new EventEmitter<any>();
  private destroy$: Subject<boolean> = new Subject<boolean>();
  alignFilter = { offset: 15, width: 200 };

  ngOnInit(): void {
    if (this.resetAllEvent) {
      this.resetAllEvent.pipe(takeUntil(this.destroy$)).subscribe(() => (this.selectFilter.value = null));
    }
  }

  ngAfterViewInit(): void {
    const offsetWidth = this.selectLabel?.nativeElement.offsetWidth;
    this.selectFilter.panelWidth = this.alignFilter.width;
    if (this.selectFilter?._positions?.[0]) {
      this.selectFilter._positions[0].offsetX = -offsetWidth + this.alignFilter.offset;
    }
  }

  toggleAllSelection(): void {
    this.filter.isAllSelected = this.selectFilter.options.first.selected;
    this.selectFilter.options.forEach((item: MatOption) => (this.filter.isAllSelected ? item.select() : item.deselect()));
    this.filter.options.forEach((el: FilterOptions) => (el.isActive = !!this.filter.isAllSelected));
    this.selectedList.emit(this.filter);
  }

  updateSelectedFilters(option: FilterOptions): void {
    option.isActive = !option.isActive;
    const notActiveOptions = this.filter.options.filter((el) => !el.isActive);
    this.filter.isAllSelected = !notActiveOptions.length;
    this.filter.isAllSelected ? this.selectFilter.options.first.select() : this.selectFilter.options.first.deselect();
    this.selectedList.emit(this.filter);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
