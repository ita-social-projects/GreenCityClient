import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import { SearchService } from '../../../../service/search/search.service';
import { SearchModel } from '../../../../model/search/search.model';
import { NewsSearchModel } from '../../../../model/search/newsSearch.model';
import { TipsSearchModel } from '../../../../model/search/tipsSearch.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})

export class SearchPopupComponent implements OnInit, OnDestroy {
  public isTipsSearchFound: boolean;
  public newsElements: NewsSearchModel[];
  public tipsElements: TipsSearchModel[];
  public isNewsSearchFound: boolean;
  public isSearchClicked = false;
  public inputValue: string;
  public itemsFound: number;
  private searchSubscription: Subscription;
  private searchModalSubscription: Subscription;

  constructor(private search: SearchService) {}

  ngOnInit() {
    this.searchModalSubscription = this.search.searchSubject.subscribe(signal => this.subscribeToSignal(signal));
  }

  public onKeyUp(event: EventTarget): void {
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
    (news && news.length > 0) ? (this.isNewsSearchFound = true, this.newsElements = news) : (this.isNewsSearchFound = false);
    (tips && tips.length > 0) ? (this.isTipsSearchFound = true, this.tipsElements = tips) : (this.isTipsSearchFound = false);
  }

  private subscribeToSignal(signal: boolean): void {
    this.isSearchClicked = signal;
  }

  public closeSearch(): void {
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
    this.inputValue = null;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.searchModalSubscription.unsubscribe();
  }
}
