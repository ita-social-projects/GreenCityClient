import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EcoNewsService } from 'src/app/component/eco-news/services/eco-news.service';
import { Subscription } from 'rxjs';
import { EcoNewsModel } from '../../models/eco-news-model';
import { UserOwnAuthService } from '../../../../service/auth/user-own-auth.service';

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
  private allEcoNews: EcoNewsModel[] = [];
  private elements: EcoNewsModel[] = [];
  public remaining = 0;
  private isLoggedIn: boolean;

  constructor(private ecoNewsService: EcoNewsService,
              private userOwnAuthService: UserOwnAuthService) { }

  ngOnInit() {
    this.ecoNewsService.getEcoNewsList();
    this.fetchAllEcoNews();
    this.addElemsToCurrentList();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
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

  private setAllAndStartingElems(data: EcoNewsModel[]): void {
    this.remaining = this.ecoNewsService.totalListLength;
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
