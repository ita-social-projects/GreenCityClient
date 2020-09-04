import { MatSnackBarComponent } from './../../../errors/mat-snack-bar/mat-snack-bar.component';
import { catchError, tap } from 'rxjs/operators';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { Subscription, throwError, Observable } from 'rxjs';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '@store/app.reducers';
import * as fromEcoNews from '@eco-news-store/eco-news.actions';
import { EcoNewsSelectors } from '@eco-news-store/eco-news.selectors';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {
  public view: boolean;
  public tagsList: Array<string>;
  public elements: EcoNewsModel[];
  public remaining = 0;
  public windowSize: number;
  public isLoggedIn: boolean;
  private ecoNewsSubscription: Subscription;
  private currentPage: number;
  public scroll: boolean;
  public numberOfNews: number;
  public elementsArePresent = true;

  constructor(
    private ecoNewsService: EcoNewsService,
    private userOwnAuthService: UserOwnAuthService,
    private store: Store<fromApp.AppState>,
    private ecoNewsSelectors: EcoNewsSelectors,
    private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.onResize();
    this.setDefaultNumberOfNews(12);
    this.setNullList();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.scroll = false;
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.view = (this.windowSize >= 576) ? this.view : true;
  }

  public onScroll(): void {
    this.scroll = true;
    this.addElemsToCurrentList();
  }

  public changeView(event: boolean): void {
    this.view = event;
  }

  public getFilterData(value: Array<string>): void {
    if (this.tagsList !== value) {
      this.setNullList();
      this.tagsList = value;
    }
    this.addElemsToCurrentList();
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => this.isLoggedIn = data && data.userId);
  }

  private handleError(error): Observable<any> {
    console.log(error);
    return throwError(error);
  }

  private addElemsToCurrentList(): void {
    if (this.tagsList) {
      this.ecoNewsSubscription = this.ecoNewsService.getNewsListByTags(this.currentPage, this.numberOfNews, this.tagsList)
        .pipe(
          tap(event => {
            if (event instanceof HttpResponse) {

              console.log('all looks good');
              // http response status code
              console.log(event);

              // shows success snackbar with green background
              // this.snackBar.openSnackBar(event.statusText,'Close','green-snackbar');
            }
          }, error => {
            console.log(error);
            // show error snackbar with red background
            this.snackBar.openSnackBar(error.message, 'Close', 'red-snackbar');

          })
        )
        .subscribe(
          (list: EcoNewsDto) => this.setList(list),
          (error) => console.log(error)
        );
    } else {
      this.ecoNewsSubscription = this.ecoNewsService.getEcoNewsListByPage(this.currentPage, this.numberOfNews)
        .subscribe((list: EcoNewsDto) => this.setList(list));
    }
    this.changeCurrentPage();
  }

  private setList(data: EcoNewsDto): void {
    this.remaining = data.totalElements;
    this.elements = this.scroll ? [...this.elements, ...data.page] : [...data.page];
    this.elementsArePresent = this.elements.length < data.totalElements;
  }

  private setNullList(): void {
    this.currentPage = 0;
    this.elements = [];
  }

  private setDefaultNumberOfNews(quantity: number): void {
    this.numberOfNews = quantity;
  }

  private changeCurrentPage(): void {
    this.currentPage += 1;
  }

  ngOnDestroy() {
    this.ecoNewsSubscription.unsubscribe();
  }
}
