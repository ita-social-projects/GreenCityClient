import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { FilterOptions, FilterSelect } from 'src/app/main/interface/filter-select.interface';

@Component({
  selector: 'app-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.scss']
})
export class FilterSelectComponent {
  @Input() filter: FilterSelect;
  @ViewChild('selectFilter') selectFilter: MatSelect;

  @Output() selectAll = new EventEmitter<any>();
  @Output() selectedList = new EventEmitter<any>();

  constructor(private langService: LanguageService) {}

  toggleAllSelection(): void {
    this.filter.isAllSelected = this.selectFilter.options.first.selected;
    this.selectFilter.options.forEach((item: MatOption) => (this.filter.isAllSelected ? item.select() : item.deselect()));
    this.filter.options.forEach((el: FilterOptions) => (el.isActive = this.filter.isAllSelected ? true : false));
    this.selectAll.emit(this.filter);
  }

  updateSelectedFilters(option: FilterOptions): void {
    option.isActive = !option.isActive;
    const notActiveOptions = this.filter.options.filter((el) => !el.isActive);
    this.filter.isAllSelected = !notActiveOptions.length;
    this.filter.isAllSelected ? this.selectFilter.options.first.select() : this.selectFilter.options.first.deselect();
    this.selectedList.emit(this.filter);
  }

  getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
