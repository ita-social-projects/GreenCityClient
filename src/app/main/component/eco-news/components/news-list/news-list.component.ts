import { Breakpoints } from '../../../../config/breakpoints.constants';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoNewsState } from 'src/app/store/state/ecoNews.state';
import { GetEcoNewsByTagsAction, GetEcoNewsByPageAction } from 'src/app/store/actions/ecoNews.actions';
import { Router } from '@angular/router';
import { tagsListEcoNewsData } from '@eco-news-models/eco-news-consts';
import { FormControl, Validators } from '@angular/forms';
import { Patterns } from '@assets/patterns/patterns';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {
  view: boolean;
  gallery: boolean;
  tagsList: Array<string> = [];
  elements: EcoNewsModel[];
  remaining = 0;
  windowSize: number;
  isLoggedIn: boolean;
  userId: number;
  scroll: boolean;
  numberOfNews: number;
  newsTotal: number;
  elementsArePresent = true;
  tagList: FilterModel[] = tagsListEcoNewsData;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  bookmarkSelected = false;
  hasNext = true;
  isLoading = false;
  private page = 0;
  noNewsMatch = false;
  searchToggle = false;
  searchNewsControl = new FormControl('', [Validators.maxLength(30), Validators.pattern(Patterns.NameInfoPattern)]);
  private searchResultSubscription: Subscription;
  econews$ = this.store.select((state: IAppState): IEcoNewsState => state.ecoNewsState);
  searchQuery: string;

  constructor(
    private ecoNewsService: EcoNewsService,
    private userOwnAuthService: UserOwnAuthService,
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.onResize();
    this.setDefaultNumberOfNews(12);
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.scroll = false;
    this.setLocalizedTags();
    this.localStorageService.setCurentPage('previousPage', '/news');

    // if (!this.page || !this.elements?.length) {
    //   this.dispatchStore(true);
    // }

    this.econews$.subscribe((value: IEcoNewsState) => {
      this.page = value.pageNumber;
      if (value.ecoNews) {
        this.elements = [...value.pages];
        const data = value.ecoNews;
        this.hasNext = data.hasNext;
        this.remaining =
          Math.abs(data.totalElements - value.countOfEcoNews) > 0 && value.countOfEcoNews !== 0 ? value.countOfEcoNews : data.totalElements;
        this.elementsArePresent = this.elements.length < data.totalElements;
      }
    });

    this.searchNewsControl.valueChanges.subscribe((value) => {
      if (this.searchResultSubscription) {
        this.searchResultSubscription.unsubscribe();
      }

      this.cleanNewsList();
      if (value.trim()) {
        this.searchNewsByTitle(value.trim());
      } else {
        console.log('hh');
        this.dispatchStore(true);
      }
    });
  }

  private getNews() {
    if (this.bookmarkSelected) {
      this.getUserFavoriteNews();
    } else {
      const searchTitle = this.searchNewsControl.value.trim();

      if (searchTitle) {
        this.searchNewsByTitle(searchTitle);
      } else {
        this.dispatchStore(false);
      }
    }
  }

  private getNewsByPage() {
    this.ecoNewsService.getEcoNewsListByPage(this.page, this.numberOfNews).subscribe((res) => {
      this.isLoading = false;
      if (res.page.length > 0) {
        this.newsTotal = res.totalElements;
        this.elements.push(...res.page);
        this.hasNext = res.hasNext;
      } else {
        this.noNewsMatch = true;
      }
    });
  }

  private searchNewsByTitle(title: string) {
    this.searchResultSubscription = this.ecoNewsService.getEcoNewsListByTitle(title, this.page, this.numberOfNews).subscribe((res) => {
      this.isLoading = false;
      if (res.page.length > 0) {
        this.newsTotal = res.totalElements;
        this.elements.push(...res.page);
        this.hasNext = res.hasNext;
        this.page++;
      } else {
        this.noNewsMatch = true;
      }
    });
  }

  private setLocalizedTags(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$));
  }

  onResize(): void {
    this.getSessionStorageView();
    this.windowSize = window.innerWidth;
    const isGalleryView = !!this.gallery;
    this.view = this.windowSize > Breakpoints.tabletLow ? true : isGalleryView;
  }

  private getSessionStorageView(): void {
    const view = sessionStorage.getItem('viewGallery');
    if (view) {
      this.gallery = JSON.parse(view);
    }
  }

  onScroll(): void {
    this.scroll = true;
    // this.dispatchStore(false);
    this.getNews();
  }

  changeView(event: boolean): void {
    this.view = event;
  }

  getFilterData(value: Array<string>): void {
    if (this.tagsList !== value) {
      this.tagsList = value;
    }
    this.hasNext = true;
    this.page = 0;
    this.dispatchStore(true);
  }

  cancelSearch(): void {
    this.searchNewsControl.value.trim() === '' ? (this.searchToggle = false) : this.searchNewsControl.setValue('');
  }

  search(): void {
    this.searchToggle = !this.searchToggle;
  }

  private getUserFavoriteNews(): void {
    this.ecoNewsService.getUserFavoriteNews(this.page, this.numberOfNews, this.userId).subscribe((res) => {
      this.isLoading = false;
      this.elements.push(...res.page);
      this.page++;
      this.newsTotal = res.totalElements;
      this.hasNext = res.hasNext;
    });
  }

  showSelectedNews(): void {
    this.bookmarkSelected = !this.bookmarkSelected;
    if (this.bookmarkSelected) {
      this.cleanNewsList();
      this.getUserFavoriteNews();
    } else {
      this.cleanNewsList();
      this.getNews();
    }
  }

  private cleanNewsList(): void {
    this.isLoading = true;
    this.hasNext = true;
    this.page = 0;
    this.elements = [];
    this.noNewsMatch = false;
    this.newsTotal = 0;
  }

  dispatchStore(res: boolean): void {
    if (!this.hasNext || this.page === undefined) {
      return;
    }

    const action = this.tagsList.length
      ? GetEcoNewsByTagsAction({ currentPage: this.page, numberOfNews: this.numberOfNews, tagsList: this.tagsList, reset: res })
      : GetEcoNewsByPageAction({ currentPage: this.page, numberOfNews: this.numberOfNews, reset: res });

    this.store.dispatch(action);
    this.page++;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => {
      this.isLoggedIn = data?.userId;
      this.userId = data.userId;
    });
  }

  private setDefaultNumberOfNews(quantity: number): void {
    this.numberOfNews = quantity;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
