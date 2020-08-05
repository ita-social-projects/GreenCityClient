import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { FilterModel } from '@eco-news-models/filter.model';


@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.scss']
})

export class FilterNewsComponent implements OnInit {
  public filters: Array<FilterModel> = [];
  private tagsSubscription: Subscription;

  @Output() tagsList = new EventEmitter<Array<string>>();

  constructor(private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.emitActiveFilters();
    this.getPresentTags();
  }

  public emitTrueFilterValues(): Array<string> {
    return this.filters.filter(el => el.isActive).map(el => el.name);
  }

  public emitActiveFilters(): void {
    this.tagsList.emit(this.emitTrueFilterValues());
  }

  public toggleFilter(currentFilter: string): void {
    this.filters.map(el => el.isActive = el.name === currentFilter ? !el.isActive : el.isActive);
    this.emitActiveFilters();
    this.setSessionStorageFilters();
  }

  private setTags(tags: Array<string>): void {
    const savedFilters = this.getSessionStorageFilters();
    this.filters = tags.map((filter: string) => ({ name: filter, isActive: typeof savedFilters.find(el => el === filter) !== 'undefined'}));
    this.emitActiveFilters();
  }

  private getPresentTags(): void {
    this.tagsSubscription = this.ecoNewsService.getAllPresentTags()
      .subscribe((tag: Array<string>) => this.setTags(tag));
  }

  private setSessionStorageFilters() {
    sessionStorage.setItem('activeFilters', JSON.stringify(this.emitTrueFilterValues()));
  }

  private getSessionStorageFilters() {
    const filters = sessionStorage.getItem('activeFilters');
    return filters !== null ? JSON.parse(filters) : [];
  }
}
