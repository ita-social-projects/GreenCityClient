import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EcoNewsService } from 'src/app/component/eco-news/services/eco-news.service';
import { Subscription } from 'rxjs';
import { EcoNewsModel } from '../../models/eco-news-model';
import { UserOwnAuthService } from '../../../../service/auth/user-own-auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../../store/app.reducers';
import * as fromEcoNews from './../../store/eco-news.actions';
import { EcoNewsSelectors } from '../../store/eco-news.selectors';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {
  private view: boolean;
  private iterator = 0;
  private gridOutput: Array<string>;
  private ecoNewsSubscription: Subscription;
  private allEcoNews: any;
  private elements: any;
  public remaining = 0;
  private isLoggedIn: boolean;

  constructor(
    private ecoNewsService: EcoNewsService,
    private userOwnAuthService: UserOwnAuthService,
    private store: Store<fromApp.AppState>,
    private ecoNewsSelectors: EcoNewsSelectors) { }

  ngOnInit() {
    this.ecoNewsService.getEcoNewsList();
    this.fetchAllEcoNews();
    this.addElemsToCurrentList();
    //this.fetchEcoNewsList();
    //this.ecoNewsService.getEcoNewsList();
    //this.fetchAllEcoNews();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  private fetchEcoNewsList(): void {
    this.ecoNewsSelectors.ecoNewsModule$.subscribe(ecoNews => {
      let data = ecoNews.ecoNewsList;
      this.allEcoNews = [...data];
      this.elements = data.slice(0, 12);
      this.iterator = this.elements.length;
      this.remaining = this.allEcoNews.length;
    });

    // dispatch GetDefaultNewsList action which triggers getDefaultNewsList effect
    this.store.dispatch(new fromEcoNews.GetDefaultNewsList());
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => this.isLoggedIn = data && data.userId);
  }

  private fetchAllEcoNews(): void {
    this.ecoNewsSubscription = this.ecoNewsService
      .newsListSubject
      .subscribe(this.setAllAndStartingElems.bind(this));
  }

  private setAllAndStartingElems(data: EcoNewsModel[]): void {
    this.remaining = this.ecoNewsService.totalListLength;
  }

  public onScroll(): void {
    this.addElemsToCurrentList();
  }

  private addElemsToCurrentList(): void {
    this.ecoNewsSubscription = this.ecoNewsService.getEcoNewsListByPage(this.iterator++,12)
      .subscribe(this.setList.bind(this));
  }

  public setList(data): void {
    this.elements = [...this.elements, ...data.page];
  }

  private changeView(event: boolean): void {
    this.view = event;
  }

  private getFilterData(value: Array<string>): void {
    // this.gridOutput = value;
    // this.ecoNewsService.getEcoNewsFilteredByTag(value);
    console.log(this.iterator, this.elements);
    this.gridOutput = value;
    this.ecoNewsSubscription = this.ecoNewsService.getNewsListByTags(this.iterator++, 12, value)
      .subscribe(this.setList.bind(this));
  }

  private setNullList(): void {
    this.iterator = 0;
    this.elements = [];
  }

  ngOnDestroy() {
    this.ecoNewsSubscription.unsubscribe();
  }
}
