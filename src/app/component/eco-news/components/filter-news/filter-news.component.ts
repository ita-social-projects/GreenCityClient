import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EcoNewsService } from 'src/app/component/eco-news/services/eco-news.service';
import { Subscription } from 'rxjs';
import { FilterModel } from '../../models/filter.model';


@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.scss']
})

export class FilterNewsComponent implements OnInit {
  private tagsSubscription: Subscription;
  private filters: Array<FilterModel> = [];

  @Output() gridOutput = new EventEmitter<Array<string>>();

  constructor(private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.emitActiveFilters();
    this.getPresentTags();
  }

  private getPresentTags(): void {
    this.tagsSubscription = this.ecoNewsService.getAllPresentTags().subscribe(this.setTags.bind(this));
  }

  private setTags(tags: Array<string>): void {
    tags.map((filter: string) => {
      this.filters = [...this.filters, ({name: filter, isActive: false})];
    });
  }

  private emitActiveFilters(): void {
    this.gridOutput.emit(this.emitTrueFilterValues());
  }

  private emitTrueFilterValues(): Array<string> {
    let trueFilterValuesArray = [];

    this.filters.map(el => {
      if (el.isActive) {
        trueFilterValuesArray = [...trueFilterValuesArray, el.name];
      }
    });
    return trueFilterValuesArray;
  }

  private toggleFilter(currentFilter: string): void {
    this.filters.map(el => {
      if (el.name === currentFilter) {
        el.isActive = !el.isActive;
      }
    });
    this.emitActiveFilters();
  }
}
