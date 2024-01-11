import { NewsSearchModel } from '@global-models/search/newsSearch.model';
import { SearchDataModel } from '@global-models/search/search.model';
import { searchIcons } from '../../main/image-pathes/search-icons';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subject } from 'rxjs';
import { map, distinctUntilChanged, tap, debounceTime, take, takeUntil } from 'rxjs/operators';
import { SearchService } from '@global-service/search/search.service';
import { FilterByitem } from '../../main/component/layout/components/models/search-dto';
import { SearchCategory } from '../search-popup/search-consts';

@Component({
  selector: 'app-search-all-results',
  templateUrl: './search-all-results.component.html',
  styleUrls: ['./search-all-results.component.scss']
})
export class SearchAllResultsComponent implements OnInit, OnDestroy {
  public displayedElements: NewsSearchModel[] = [];
  public isSearchFound: boolean;
  public itemsFound = 0;
  public currentPage = 0;
  public searchCategory: string;
  public sortType = '';
  public sortTypes = ['Relevance', 'Newest', 'Oldest'];
  public sortTypesLocalization = [
    'search.search-all-results.relevance',
    'search.search-all-results.newest',
    'search.search-all-results.oldest'
  ];
  public inputValue: string;
  public isLoading = true;
  public searchIcons = searchIcons;
  public filterByItems: FilterByitem[] = [
    { category: SearchCategory.NEWS, name: 'news' },
    { category: SearchCategory.EVENTS, name: 'events' }
  ];
  private destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(private searchService: SearchService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroySub)).subscribe((params) => {
      this.inputValue = params.query;
      this.searchCategory = params.category || SearchCategory.NEWS;
    });

    this.getSearchResults();
    this.onAddSearchInputListener();
  }

  public handleInputChanges(event): void {
    this.inputValue = event.target.value;
    this.onSearchUpdateQuery();
  }

  private onAddSearchInputListener() {
    fromEvent(document.querySelector('#search-input'), 'input')
      .pipe(
        debounceTime(300),
        map((e) => (e.target as HTMLInputElement).value),
        distinctUntilChanged(),
        tap(() => {
          this.resetData();
          this.isLoading = true;
          this.onSearchUpdateQuery().then(() => this.getSearchResults());
        }),
        take(1)
      )
      .subscribe();
  }

  private getSearchResults(): void {
    this.searchService
      .getAllResultsByCat(this.inputValue, this.searchCategory, this.currentPage, this.sortType)
      .pipe(takeUntil(this.destroySub))
      .subscribe((data) => this.setElems(data));
    this.isSearchFound = true;
  }

  private setElems(data: SearchDataModel): void {
    this.isLoading = false;
    this.displayedElements = [...this.displayedElements, ...data.page];

    this.itemsFound = data.totalElements;

    if (this.displayedElements.length === this.itemsFound) {
      this.isSearchFound = false;
    } else {
      this.forceScroll();
    }
  }

  private onSearchUpdateQuery() {
    return this.router.navigate([], {
      queryParams: {
        query: this.inputValue,
        category: this.searchCategory
      }
    });
  }

  private forceScroll() {
    if (document.documentElement.clientHeight === document.documentElement.scrollHeight) {
      this.onScroll();
    }
  }

  public onScroll(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      this.currentPage++;
      this.getSearchResults();
    }
  }

  public changeCurrentSorting(newSorting: number): void {
    this.isLoading = true;
    [this.sortTypes[0], this.sortTypes[newSorting]] = [this.sortTypes[newSorting], this.sortTypes[0]];
    [this.sortTypesLocalization[0], this.sortTypesLocalization[newSorting]] = [
      this.sortTypesLocalization[newSorting],
      this.sortTypesLocalization[0]
    ];
    switch (this.sortTypes[0]) {
      case 'Relevance':
        this.sortType = '';
        break;
      case 'Newest':
        this.sortType = 'desc';
        break;
      case 'Oldest':
        this.sortType = 'asc';
        break;
      default:
        this.sortType = '';
    }
    this.resetData();
    if (this.inputValue) {
      this.getSearchResults();
    }
  }

  public onFilterByClick(item: FilterByitem) {
    if (this.searchCategory === item.category) {
      return;
    }
    this.searchCategory = item.category;
    this.onSearchUpdateQuery();
  }

  private resetData(): void {
    this.isSearchFound = true;
    this.itemsFound = 0;
    this.currentPage = 0;
    this.displayedElements = [];
  }

  ngOnDestroy() {
    this.destroySub.next(true);
  }
}
