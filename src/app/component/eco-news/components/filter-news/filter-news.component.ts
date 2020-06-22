import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EcoNewsService } from 'src/app/component/eco-news/services/eco-news.service';
import { Subscription } from 'rxjs';
import { FilterModel } from '@eco-news-models/filter.model';


@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.scss']
})

export class FilterNewsComponent implements OnInit {
  public filters: Array<FilterModel> = [];
  private tagsSubscription: Subscription;

  @Output() gridOutput = new EventEmitter<Array<string>>();

  constructor(private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.emitActiveFilters();
    this.getPresentTags();
  }

private setTags(tags: Array<string>): void {
    const filtersWithProperties = tags.map((filter: string) =>
      ({name: filter, isActive: false})
    );
    this.filters = [...filtersWithProperties];
}

  public emitTrueFilterValues() {
    return this.filters.filter(el => el.isActive).map(item => item.name);
  }

  public emitActiveFilters(): void {
    this.gridOutput.emit(this.emitTrueFilterValues());
  }

  public toggleFilter(currentFilter: string): void {
    this.filters.map(el => el.isActive = el.name === currentFilter ? !el.isActive : el.isActive);
    this.emitActiveFilters();
  }

  private getPresentTags(): void {
    this.tagsSubscription = this.ecoNewsService.getAllPresentTags()
      .subscribe((tag: Array<string> ) => this.setTags(tag));
  }
}
