import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-news',
  templateUrl: './filter-news.component.html',
  styleUrls: ['./filter-news.component.css']
})

export class FilterNewsComponent implements OnInit {

  private filters = ['news', 'events', 'courses', 'initiatives', 'ads'];

  styleGrid = {
    news: true,
    events: false,
    courses: false,
    initiatives: false,
    ads: false
  };

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

      for (const i in this.styleGrid) {
        if (this.styleGrid[i] === true) {
          trueFilterValuesArray.push(i);
        }
      }
      return trueFilterValuesArray;
  }

  private selectFilter(currentFilter: string): void {
    this.styleGrid[currentFilter] = true;
    this.emitter();
  }

  private deselectFilter(unselectFilter: string, event): void {
    this.styleGrid[unselectFilter] = false;
    event.stopPropagation();
    this.emitter();
  }
}
