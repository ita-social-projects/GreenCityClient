import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FilterModel } from '@eco-news-models/filter.model';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss'],
})
export class TagFilterComponent implements OnInit, OnChanges {
  public filters: Array<FilterModel> = [];
  @Input() private storageKey: string;
  @Input() public tagsListData = [];
  @Input() public header: string;
  @Output() tagsList = new EventEmitter<Array<string>>();

  ngOnInit() {
    this.emitActiveFilters();
  }

  ngOnChanges(changes) {
    const { currentValue } = changes.tagsListData;
    if (currentValue !== '' && currentValue) {
      this.setTags(currentValue);
    }
  }

  public emitTrueFilterValues(): Array<string> {
    return this.filters.filter((el) => el.isActive).map((el) => el.name);
  }

  public emitActiveFilters(): void {
    this.tagsList.emit(this.emitTrueFilterValues());
  }

  public toggleFilter(currentFilter: string): void {
    this.filters.forEach((el) => (el.isActive = el.name === currentFilter ? !el.isActive : el.isActive));
    this.emitActiveFilters();
    this.setSessionStorageFilters();
  }

  private setTags(tags: Array<string>): void {
    const savedFilters = this.getSessionStorageFilters();
    this.filters = tags.map((filter: string) => ({
      name: filter,
      isActive: typeof savedFilters.find((el) => el === filter) !== 'undefined',
    }));
    this.emitActiveFilters();
  }

  private setSessionStorageFilters() {
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.emitTrueFilterValues()));
  }

  private getSessionStorageFilters() {
    const filters = sessionStorage.getItem(this.storageKey);
    return filters !== null ? JSON.parse(filters) : [];
  }
}
