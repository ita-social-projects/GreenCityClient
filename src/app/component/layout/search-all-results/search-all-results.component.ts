import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchModel } from '../../../model/search/search.model';
import { SearchService } from '../../../service/search/search.service';
import { NewsSearchModel } from '../../../model/search/newsSearch.model';
import { TipsSearchModel } from '../../../model/search/tipsSearch.model';
import { SearchItemComponent } from '../components/search-popup/search-item/search-item.component';

@Component({
  selector: 'app-search-all-results',
  templateUrl: './search-all-results.component.html',
  styleUrls: ['./search-all-results.component.scss']
})
export class SearchAllResultsComponent implements OnInit, OnDestroy {
  private inputValues = ['relevance', 'newest', 'latest'];
  readonly dropDownArrow = 'assets/img/arrow_grey.png';
  private searchSubscription: Subscription;
  private displayedElements: NewsSearchModel[] = [];
  private elements: NewsSearchModel[];
  private dropdownVisible: boolean;
  private isSearchFound: boolean;
  private inputValue: string;
  private itemsFound = 0;

  constructor(private search: SearchService) { }

  ngOnInit() {
    this.search.toggleAllSearch(true);
  }

  private onScroll(): void {
    this.loadNextElements();
  }

  private loadNextElements(): void {
    this.spliceResults();
  }

  private onKeyUp(event: EventTarget): void {
    this.displayedElements = [];
    if (event['value'].length > 0) {
      this.inputValue = event['value'];
      this.searchSubscription = this.search.getAllSearch(this.inputValue, this.inputValues[0])
        .subscribe(this.getSearchData.bind(this));
    } else {
      this.resetData();
    }
  }

  private getSearchData(data: SearchModel): void {
    this.getNews(data.ecoNews);
    data.countOfResults ? this.itemsFound = data.countOfResults : null;
    this.spliceResults();
  }

  private getNews(news): void {
    (news && news.length > 0) ? (this.isSearchFound = true, this.elements = news) : (this.isSearchFound = false);
  }

  private spliceResults(): void {
    const splicedData = this.elements.splice(0, 9);
    for (let i = 0; i < 9; i++) {
      if (splicedData[i]) {
        this.displayedElements.push(splicedData[i]);
      }
    }
  }

  private changeCurrentSorting(newSorting: number): void {
    [this.inputValues[0], this.inputValues[newSorting]] = [this.inputValues[newSorting], this.inputValues[0]];

  }

  private toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  private resetData(): void {
    this.itemsFound = 0;
    this.elements = null;
    this.displayedElements = null;
  }

  ngOnDestroy() {
    this.search.toggleAllSearch(false);
  }
}
