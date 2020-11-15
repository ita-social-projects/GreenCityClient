import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { SearchService } from '@global-service/search/search.service';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';

@Component({
  selector: 'app-search-all-results',
  templateUrl: './search-all-results.component.html',
  styleUrls: ['./search-all-results.component.scss']
})
export class SearchAllResultsComponent implements OnInit, OnDestroy {
  public displayedElements: NewsSearchModel[] = [];
  public isSearchFound: boolean;
  public itemsFound: number = 0;
  public currentPage: number = 0;
  public searchCategory: string;
  public sortType: string;
  public sortTypes = ["Relevance", "Newest", "Oldest"];
  public sortTypesLocalization = ["search.search-all-results.relevance", "search.search-all-results.newest", "search.search-all-results.oldest"];
  public dropdownVisible: boolean;
  public inputValue: string;
  public scroll: boolean;
  private querySubscription: Subscription;

  readonly dropDownArrow = 'assets/img/arrow_grey.png';

  constructor(private search: SearchService, private snackBar: MatSnackBarComponent, private route: ActivatedRoute) { 
    this.querySubscription = route.queryParams.subscribe(
      (queryParam: any) => {
          this.inputValue = queryParam['searchQuery'];
          this.searchCategory = queryParam['searchCategory'] || 'econews';
      }
    );
  }

  ngOnInit() {
    this.scroll = false;
    this.sortType = '';

    this.route.queryParams.subscribe(params => {
      this.inputValue = params['searchQuery'];
      this.searchCategory = params['searchCategory'] || 'econews';
    });

    if (this.inputValue && this.searchCategory) {
      this.getSearchResults();
    }

    fromEvent(document.querySelector("#search-input"), 'input')
      .pipe(
        map(e => (<HTMLInputElement>e.target).value),
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => this.resetData()),
        switchMap(value => this.search.getAllResults(value, this.searchCategory, this.currentPage, this.sortType))
      )
      .subscribe(
        data => this.setElems(data),
        err => this.errorHandler(err)
      );
  }

  private getSearchResults(): void {
    this.search.getAllResults(this.inputValue, this.searchCategory, this.currentPage, this.sortType)
        .subscribe(
          data => this.setElems(data),
          err => this.errorHandler(err)
        );
    this.isSearchFound = true;
  }

  private setElems(data: any): void {
    this.displayedElements = this.displayedElements && this.scroll ? [...this.displayedElements, ...data.page] : [...data.page];
    this.itemsFound = data.totalElements;
    if (this.displayedElements.length === this.itemsFound) {
      this.isSearchFound = false;
    }
  }

  public onScroll(): void {
    this.scroll = true;
    this.changeCurrentPage();
    this.getSearchResults();
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
      this.getSearchResults();
    } else {
      this.resetData();
    }
  }

  public toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  private resetData(): void {
    this.isSearchFound = true;
    this.itemsFound = 0;
    this.currentPage = 0;
    this.displayedElements = null;
  }

  private changeCurrentPage(): void {
    this.currentPage += 1;
  }

  private errorHandler(error: any): void {
    this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.', 'X', 'red-snackbar');
    return error;
  }

  ngOnDestroy() {
    this.search.toggleAllSearch(false);
    this.querySubscription.unsubscribe();
  }
}
