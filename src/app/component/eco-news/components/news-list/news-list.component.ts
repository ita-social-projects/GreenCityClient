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
  public gridOutput: Array<string>;
  public elements: EcoNewsModel[];
  public remaining = 0;
  public windowSize: number;
  public isLoggedIn: boolean;
  private ecoNewsSubscription: Subscription;
  private iterator: number;
  public scroll: boolean;

  constructor(
    private ecoNewsService: EcoNewsService,
    private userOwnAuthService: UserOwnAuthService,
    private store: Store<fromApp.AppState>,
    private ecoNewsSelectors: EcoNewsSelectors) { }

  ngOnInit() {
    this.onResize();
    this.setNullList();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.scroll = false;
  }

  public onResize(): void {
    this.windowSize = window.innerWidth;
    this.view = (this.windowSize > 576) ? this.view : true;
  }

  public onScroll(): void {
    this.scroll = true;
    this.addElemsToCurrentList();
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

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => this.isLoggedIn = data && data.userId);
  }

  private addElemsToCurrentList(): void {
    this.ecoNewsSubscription = this.gridOutput ?
      this.ecoNewsService.getNewsListByTags(this.iterator++, 12, this.gridOutput)
        .subscribe((list: EcoNewsDto) => this.setList(list)) :
      this.ecoNewsService.getEcoNewsListByPage(this.iterator++, 12)
        .subscribe((list: EcoNewsDto) => this.setList(list));
  }

  private setList(data: EcoNewsDto): void {
    this.remaining = data.totalElements;
    this.elements = this.scroll ? [...this.elements, ...data.page] : [...data.page];
  }

  private setNullList(): void {
    this.iterator = 0;
    this.elements = [];
  }

  ngOnDestroy() {
    this.ecoNewsSubscription.unsubscribe();
  }
}
