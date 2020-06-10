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
  private iterator: number;
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
    this.setNullList();
    //this.addElemsToCurrentList();
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

  public onScroll(): void {
    this.addElemsToCurrentList();
  }

  private addElemsToCurrentList(): void {
    if(this.gridOutput)
    {
      this.ecoNewsSubscription = this.ecoNewsService.getNewsListByTags(this.iterator++, 12, this.gridOutput)
        .subscribe(this.setList.bind(this));
    }
    else {
      this.ecoNewsSubscription = this.ecoNewsService.getEcoNewsListByPage(this.iterator++,12)
        .subscribe(this.setList.bind(this));
    }
  }

  public setList(data): void {
    this.remaining = data.totalElements;
    this.elements = [...this.elements, ...data.page];
  }

  private changeView(event: boolean): void {
    this.view = event;
  }

  private getFilterData(value: Array<string>): void {
    if(this.gridOutput !== value) {
      this.setNullList();
      this.gridOutput = value;
    }
    this.addElemsToCurrentList();
  }

  private setNullList(): void {
    this.iterator = 0;
    this.elements = [];
  }

  ngOnDestroy() {
    this.ecoNewsSubscription.unsubscribe();
  }
}
