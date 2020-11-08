import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchModel } from '@global-models/search/search.model';
import { SearchService } from '@global-service/search/search.service';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-search-all-results',
  templateUrl: './search-all-results.component.html',
  styleUrls: ['./search-all-results.component.scss']
})
export class SearchAllResultsComponent implements OnInit, OnDestroy {
  public inputValues = ['Relevance', 'Newest', 'Oldest'];
  public searchCategory: string;
  public sortType: string;
  public displayedElements: NewsSearchModel[] = [];
  public elements: NewsSearchModel[] = [];
  public dropdownVisible: boolean;
  public isSearchFound: boolean;
  public inputValue: string;
  public itemsFound: number = 0;
  public currentPage: number = 0;
  public scroll: boolean;
  private querySubscription: Subscription;

  readonly dropDownArrow = 'assets/img/arrow_grey.png';

  constructor(private search: SearchService, private route: ActivatedRoute) { 
    this.querySubscription = route.queryParams.subscribe(
      (queryParam: any) => {
          this.inputValue = queryParam['searchQuery'];
          this.searchCategory = queryParam['searchCategory'] || 'econews';
      }
    );
  }

  ngOnInit() {
    this.search.toggleAllSearch(true);
    this.getAllElems();
    this.scroll = false;
    this.sortType = '';

    // get searchQuery from prev page
    this.route.queryParams.subscribe(params => {
      this.inputValue = params['searchQuery'];
      this.searchCategory = params['searchCategory'] || 'econews';
    });

    if (this.inputValue && this.searchCategory) {
      this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType);
      this.isSearchFound = true;
    }
  }

  private getAllElems(): void {
    this.search.getElementsAsObserv()
      .subscribe(data => this.setElems(data));
  }

  private setElems(data): void {
    // set new elements to array of rendered items
    this.displayedElements = this.displayedElements && this.scroll ? [...this.displayedElements, ...data.page] : [...data.page];
    this.elements = data.page;
    this.itemsFound = data.totalElements;
  }

  public onScroll(): void {
    // set that scrolling is active
    this.scroll = true;
    // set new page number to display
    this.changeCurrentPage();
    // send request to get results from search
    this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType);
    this.isSearchFound = true;
  }

  // private loadNextElements(): void {
  //   this.spliceResults();
  // }

  public onKeyUp(event: EventTarget): void {
    this.displayedElements = null;
    // if input of search is changed then clear rendered items
    this.resetData();
    const VALUE = 'value';
    if (event[VALUE].length > 0) {
      // get value from input for search
      this.inputValue = event[VALUE];
      // send request to get results from search
      this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType);
      this.isSearchFound = true;
    }
    if (event[VALUE].length === 0) {
      this.displayedElements = null;
      // if input is empty - clear data for displaying
      this.resetData();
    }
  }

  // private getSearchData(data: SearchModel): void {
  //   this.getNews(data.ecoNews);
  //   this.itemsFound = data.countOfResults ? data.countOfResults : null;
  //   this.spliceResults();
  // }

  // private getNews(news): void {
  //   this.isSearchFound = news && news.length;
  //   this.elements = this.isSearchFound ? news : this.elements;
  // }

  // private spliceResults(): void {
  //   if (this.elements) {
  //     const splicedData = this.elements.splice(0, 9);
  //     this.displayedElements = splicedData.filter(elem => elem);
  //   }
  // }

  public changeCurrentSorting(newSorting: number): void {
    [this.inputValues[0], this.inputValues[newSorting]] = [this.inputValues[newSorting], this.inputValues[0]];
    switch (this.inputValues[0]) {
      case 'Relevance':
        this.sortType = ``;
        break;
      case 'Newest':
        this.sortType = `creation_date,desc`;
        break;
      case 'Oldest':
        this.sortType = `creation_date,asc`;
        break;
      default:
        this.sortType = '';
    };
    this.resetData();
    if (this.inputValue) {
      this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType);
      this.isSearchFound = true;
    } else {
      this.resetData();
    }
  }

  public toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  private resetData(): void {
    this.itemsFound = 0;
    this.currentPage = 0;
    this.elements = null;
    this.displayedElements = null;
  }

  private changeCurrentPage(): void {
    this.currentPage += 1;
  }

  ngOnDestroy() {
    this.search.toggleAllSearch(false);
  }
}
