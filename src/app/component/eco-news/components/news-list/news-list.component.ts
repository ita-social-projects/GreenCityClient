import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

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
  private tagsSubscription: Subscription;
  public tagList: string[];

  constructor(
    private ecoNewsService: EcoNewsService,
    private userOwnAuthService: UserOwnAuthService,
    private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.onResize();
    this.setDefaultNumberOfNews(12);
    this.setNullList();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.scroll = false;

    this.tagsSubscription = this.ecoNewsService.getAllPresentTags()
      .subscribe((tag: Array<string>) => this.tagList = tag);
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

  private addElemsToCurrentList(): void {
    if (this.tagsList) {
      this.ecoNewsSubscription = this.ecoNewsService.getNewsListByTags(this.currentPage, this.numberOfNews, this.tagsList)
        .pipe(
          catchError((error) => {
            this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.', 'X', 'red-snackbar');

            return error;
          })
        )
        .subscribe((list: EcoNewsDto) => this.setList(list));
    } else {
      this.ecoNewsSubscription = this.ecoNewsService.getEcoNewsListByPage(this.currentPage, this.numberOfNews)
        .pipe(
          catchError((error) => {
            this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.', 'X', 'red-snackbar');

            return error;
          })
        )
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
    this.elementsArePresent = true;
  }

  private setDefaultNumberOfNews(quantity: number): void {
    this.numberOfNews = quantity;
  }

  private changeCurrentPage(): void {
    this.currentPage += 1;
  }

  ngOnDestroy() {
    this.ecoNewsSubscription.unsubscribe();
    this.tagsSubscription.unsubscribe();
  }
}
