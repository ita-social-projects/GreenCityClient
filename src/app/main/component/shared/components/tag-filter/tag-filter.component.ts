import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FilterModel } from './tag-filter.model';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss']
})
export class TagFilterComponent implements OnInit {
  filters: Array<FilterModel> = [];
  @Input() private storageKey: string;
  @Input() public tagsListData = [];
  @Input() public header: string;
  @Output() tagsList = new EventEmitter<Array<string>>();

  constructor(public langService: LanguageService) {}

  ngOnInit() {
    this.filters = this.getSessionStorageFilters();
    this.emitActiveFilters();
  }

  emitTrueFilterValues(): Array<string> {
    return this.filters.filter((active) => active.isActive).map((filter) => this.langService.getLangValue(filter.nameUa, filter.name));
  }

  emitActiveFilters(): void {
    this.tagsList.emit(this.emitTrueFilterValues());
  }

  toggleFilter(currentFilter: string): void {
    this.filters.forEach((el) => (el.isActive = el.name === currentFilter ? !el.isActive : el.isActive));
    this.emitActiveFilters();
    const isAnyFilterSelcted = this.filters.some((item) => item.isActive === true);
    isAnyFilterSelcted ? this.setSessionStorageFilters() : this.cleanSessionStorageFilters();
  }

  private setSessionStorageFilters(): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.filters));
  }

  private cleanSessionStorageFilters(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  private getSessionStorageFilters() {
    const filters = sessionStorage.getItem(this.storageKey);
    return filters !== null ? JSON.parse(filters) : this.tagsListData;
  }
}
