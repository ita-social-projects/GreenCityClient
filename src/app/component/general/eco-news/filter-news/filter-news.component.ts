import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.css']
})

export class FilterNewsComponent implements OnInit {

  private filters = [{ name: 'news', isActive: false },
  { name: 'events', isActive: false },
  { name: 'courses', isActive: false },
  { name: 'initiatives', isActive: false },
  { name: 'ads', isActive: false }];

  @Output() gridOutput = new EventEmitter<Array<string>>();

  constructor() { }

  ngOnInit() {
    this.emitter();
  }

  private emitter(): void {
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

  private toggleFilterOn(currentFilter: string): void {
    for (const item of this.filters) {
      if (item.name === currentFilter) {
        item.isActive = true;
      }
    }

    this.emitter();
  }

  private toggleFilterOff(currentFilter: string, event: Event): void {
    for (const item of this.filters) {
      if (item.name === currentFilter) {
        item.isActive = false;
      }
    }

    this.emitter();
    event.stopPropagation();
  }
}
