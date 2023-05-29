import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FilterModel, TagInterface } from './tag-filter.model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss']
})
export class TagFilterComponent implements OnInit, OnChanges {
  public filters: Array<FilterModel> = [];
  @Input() private storageKey: string;
  @Input() public tagsListData = [];
  @Input() public header: string;
  @Output() tagsList = new EventEmitter<Array<string>>();

  constructor(public langService: LanguageService) {}

  ngOnInit() {
    this.filters = this.getSessionStorageFilters();
    this.emitActiveFilters();
  }

  ngOnChanges(changes) {
    if (changes.tagsListData?.currentValue) {
      this.setTags(changes.tagsListData.currentValue);
    }
  }

  public emitTrueFilterValues(): Array<string> {
    return this.filters
      .filter((active) => active.isActive)
      .map((filter) => {
        return this.getLangValue(filter.nameUa, filter.name);
      });
  }

  public emitActiveFilters(): void {
    this.tagsList.emit(this.emitTrueFilterValues());
  }

  public toggleFilter(currentFilter: string): void {
    this.filters.forEach((el) => (el.isActive = el.name === currentFilter ? !el.isActive : el.isActive));
    this.emitActiveFilters();
    this.setSessionStorageFilters();
  }

  private setTags(tags: Array<TagInterface>): void {
    const savedFilters = this.getSessionStorageFilters();
    if (!sessionStorage.getItem(this.storageKey)) {
      this.filters = tags.map((tag: TagInterface) =>
        tag.name === savedFilters || tag.nameUa === savedFilters
          ? { name: tag.name, nameUa: tag.nameUa, isActive: true }
          : { name: tag.name, nameUa: tag.nameUa, isActive: false }
      );
    }
    this.emitActiveFilters();
  }

  private setSessionStorageFilters() {
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.filters));
  }

  private getSessionStorageFilters() {
    const filters = sessionStorage.getItem(this.storageKey);
    return filters !== null ? JSON.parse(filters) : [];
  }

  getLangValue(valUa: string, valEn: string): string {
    return this.langService.getLangValue(valUa, valEn) as string;
  }
}
