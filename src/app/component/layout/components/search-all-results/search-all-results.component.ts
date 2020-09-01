import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchModel } from '@global-models/search/search.model';
import { SearchService } from '@global-service/search/search.service';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';

@Component({
  selector: 'app-search-all-results',
  templateUrl: './search-all-results.component.html',
  styleUrls: ['./search-all-results.component.scss']
})
export class SearchAllResultsComponent implements OnInit, OnDestroy {
  public inputValues = ['relevance', 'newest', 'latest'];
  public displayedElements: NewsSearchModel[] = [];
  public elements: NewsSearchModel[];
  public dropdownVisible: boolean;
  public isSearchFound: boolean;
  public inputValue: string;
  public itemsFound = 0;
  private searchSubscription: Subscription;
  readonly dropDownArrow = 'assets/img/arrow_grey.png';

  constructor(private search: SearchService) { }

  ngOnInit() {
    this.search.toggleAllSearch(true);
  }

  public onScroll(): void {
    this.loadNextElements();
  }

  private loadNextElements(): void {
    this.spliceResults();
  }

  public onKeyUp(event: EventTarget): void {
    this.displayedElements = [];
    const VALUE = 'value;';
    if (event[VALUE].length > 0) {
      this.inputValue = event[VALUE];
      this.searchSubscription = this.search.getAllSearch(this.inputValue, this.inputValues[0])
        .subscribe(data => this.getSearchData(data));
    } else {
      this.resetData();
    }
  }

  private getSearchData(data: SearchModel): void {
    this.getNews(data.ecoNews);
    this.itemsFound = data.countOfResults ? data.countOfResults : null;
    this.spliceResults();
  }

  private getNews(news): void {
    this.isSearchFound = news && news.length;
    this.elements = this.isSearchFound ? news : this.elements;
  }

  private spliceResults(): void {
    const splicedData = this.elements.splice(0, 9);
    this.displayedElements = splicedData.filter(elem => elem);
  }

  public changeCurrentSorting(newSorting: number): void {
    [this.inputValues[0], this.inputValues[newSorting]] = [this.inputValues[newSorting], this.inputValues[0]];
  }

  public toggleDropdown(): void {
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
