import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EcoNewsService } from 'src/app/service/eco-news/eco-news.service';
import { Subscription } from 'rxjs';
import { FilterModel } from '../models/filter.model';


@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.css']
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
    tags.forEach((filter: string) => {
      this.filters.push({name: filter, isActive: false});
    });
  }

  private emitActiveFilters(): void {
    this.gridOutput.emit(this.emitTrueFilterValues());
  }

  private emitTrueFilterValues(): Array<string> {
    const trueFilterValuesArray = [];

    for (const item of this.filters) {
      if (item.isActive) {
        trueFilterValuesArray.push(item.name);
      }
    }

    return trueFilterValuesArray;
  }

  private toggleFilter(currentFilter: string): void {
    for (const item of this.filters) {
      if (item.name === currentFilter) {
        item.isActive = !item.isActive;
      }
    }

    this.emitActiveFilters();
  }

}
