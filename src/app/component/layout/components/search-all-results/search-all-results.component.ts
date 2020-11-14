import { Subscription, Subject, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, filter } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '@global-service/search/search.service';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-all-results',
  templateUrl: './search-all-results.component.html',
  styleUrls: ['./search-all-results.component.scss']
})
export class SearchAllResultsComponent implements OnInit, OnDestroy {
  public sortTypes = ["Relevance", "Newest", "Oldest"];
  public sortTypesLocalization = ["search.search-all-results.relevance", "search.search-all-results.newest", "search.search-all-results.oldest"];
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
  private allElemsSubj = new Subject<any>();

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
    // this.getAllElems();
    this.scroll = false;
    this.sortType = '';

    this.route.queryParams.subscribe(params => {
      this.inputValue = params['searchQuery'];
      this.searchCategory = params['searchCategory'] || 'econews';
    });

    fromEvent(document.querySelector(".search-field"), 'input')
      .pipe(
        map(e => (<HTMLInputElement>e.target).value),
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => this.resetData()),
        filter(value => Boolean(value)),
        switchMap(value => this.search.getAllResults(value, this.searchCategory, this.currentPage, this.sortType))
      )
      .subscribe(
        data => this.setElems(data)
      );

    if (this.inputValue && this.searchCategory) {
      this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType)
        .subscribe(data => this.setElems(data));
      this.isSearchFound = true;
    }
  }

  // private getAllElems(): void {
  //   this.search.getElementsAsObserv()
  //     .subscribe(data => this.setElems(data));
  // }

  private setElems(data): void {
    this.displayedElements = this.displayedElements && this.scroll ? [...this.displayedElements, ...data.page] : [...data.page];
    this.elements = data.page;
    this.itemsFound = data.totalElements;
  }

  public onScroll(): void {
    this.scroll = true;
    this.changeCurrentPage();
    this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType)
      .subscribe(data => this.setElems(data));
    this.isSearchFound = true;
  }

  public onKeyUp(event: EventTarget): void {
    // this.displayedElements = null;
    // this.resetData();
    // const VALUE = 'value';
    // if (event[VALUE].length > 0) {
    //   this.inputValue = event[VALUE];
    //   this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType)
    //     .subscribe(data => this.setElems(data));
    //   this.isSearchFound = true;
    // }
    // if (event[VALUE].length === 0) {
    //   this.displayedElements = null;
    //   this.resetData();
    // }
  }

  public changeCurrentSorting(newSorting: number): void {
    [this.sortTypes[0], this.sortTypes[newSorting]] = [this.sortTypes[newSorting], this.sortTypes[0]];
    [this.sortTypesLocalization[0], this.sortTypesLocalization[newSorting]] = [this.sortTypesLocalization[newSorting], this.sortTypesLocalization[0]];
    switch (this.sortTypes[0]) {
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
      this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType)
        .subscribe(data => this.setElems(data));
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
    this.querySubscription.unsubscribe();
  }
}
