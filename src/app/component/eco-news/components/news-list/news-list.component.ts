import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { Subscription } from 'rxjs';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '@store/app.reducers';
import * as fromEcoNews from '@eco-news-store/eco-news.actions';
import { EcoNewsSelectors } from '@eco-news-store/eco-news.selectors';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {
  public view: boolean;
  private iterator: number;
  public gridOutput: Array<string>;
  private ecoNewsSubscription: Subscription;
  public elements: EcoNewsModel[];
  public remaining = 0;
  private isLoggedIn: boolean;

  constructor(
    private ecoNewsService: EcoNewsService,
    private userOwnAuthService: UserOwnAuthService,
    private store: Store<fromApp.AppState>,
    private ecoNewsSelectors: EcoNewsSelectors) { }

  ngOnInit() {
    this.setNullList();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => this.isLoggedIn = data && data.userId);
  }

  public onScroll(): void {
    this.addElemsToCurrentList();
  }

  private addElemsToCurrentList(): void {
    this.ecoNewsSubscription = this.gridOutput ?
      this.ecoNewsSubscription = this.ecoNewsService.getNewsListByTags(this.iterator++, 12, this.gridOutput)
        .subscribe((list: EcoNewsDto) => this.setList(list)) :
      this.ecoNewsSubscription = this.ecoNewsService.getEcoNewsListByPage(this.iterator++, 12)
        .subscribe((list: EcoNewsDto) => this.setList(list));
  }

  private setList(data: EcoNewsDto): void {
    this.remaining = data.totalElements;
    this.elements = [...this.elements, ...data.page];
  }

  public changeView(event: boolean): void {
    this.view = event;
  }

  public getFilterData(value: Array<string>): void {
    if (this.gridOutput !== value) {
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
