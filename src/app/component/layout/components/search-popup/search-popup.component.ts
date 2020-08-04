import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from '@global-service/search/search.service';
import { SearchModel } from '@global-models/search/search.model';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';
import { TipsSearchModel } from '@global-models/search/tipsSearch.model';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})

export class SearchPopupComponent implements OnInit, OnDestroy {
  public newsElements: NewsSearchModel[];
  public tipsElements: TipsSearchModel[];
  public isNewsSearchFound: boolean;
  public isTipsSearchFound: boolean;
  public isSearchClicked = false;
  public inputValue: string;
  public itemsFound: number;
  private searchSubscription: Subscription;
  private searchModalSubscription: Subscription;

  constructor(private search: SearchService) {}

  ngOnInit() {
    this.searchModalSubscription = this.search.searchSubject.subscribe(signal => this.subscribeToSignal(signal));
  }

  private onKeyUp(event: EventTarget): void {
    const VALUE = 'value';
    if (event[VALUE].length > 0) {
      this.inputValue = event[VALUE];
      this.searchSubscription = this.search.getSearch(this.inputValue)
        .subscribe(data => this.getSearchData(data));
    } else {
      this.resetData();
    }
  }

  private getSearchData(data: SearchModel): void {
    this.getNewsAndTips(data.ecoNews, data.tipsAndTricks);
    this.itemsFound = data.countOfResults;
  }

  private getNewsAndTips(news, tips): void {
    if (news.length > 0) {
      this.isNewsSearchFound = true;
      this.newsElements = news;
    } else {
      this.isNewsSearchFound = false;
    }
    if (tips.length > 0) {
      this.isTipsSearchFound = true;
      this.tipsElements = tips;
    } else {
      this.isTipsSearchFound = false;
    }
  }

  private subscribeToSignal(signal: boolean): void {
    this.isSearchClicked = signal;
  }

  private closeSearch(): void {
    this.search.closeSearchSignal();
    this.isSearchClicked = false;
    this.resetData();
  }

  private resetData(): void {
    this.newsElements = null;
    this.tipsElements = null;
    this.isNewsSearchFound = null;
    this.isTipsSearchFound = null;
    this.itemsFound = null;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.searchModalSubscription.unsubscribe();
  }
}
