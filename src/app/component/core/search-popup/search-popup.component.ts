import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../../service/search/search.service';
import { SearchModel } from '../../../model/search/search.model';
import { NewsSearchModel } from '../../../model/search/newsSearch.model';
import { TipsSearchModel } from '../../../model/search/tipsSearch.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})

export class SearchPopupComponent implements OnInit, OnDestroy {
  private searchSubscription: Subscription;
  private signalSubscription: Subscription;
  private isSearchClicked = false;
  private isNewsSearchFound: boolean;
  private isTipsSearchFound: boolean;
  private inputValue: string;
  private newsElements: NewsSearchModel[];
  private tipsElements: TipsSearchModel[];
  private itemsFound: number;

  constructor(private search: SearchService) {}

  ngOnInit() {
    this.signalSubscription = this.search.openSearchEmitter.subscribe(this.subscribeToSignal.bind(this));
  }

  private onKeyUp(event: any): void {
    if (event.target.value.length > 0) {
      this.inputValue = event.target.value;
      this.searchSubscription = this.search.getSearch(this.inputValue).subscribe(this.getSearchData.bind(this));
    } else {
      this.flushData();
    }
  }

  private getSearchData(data: SearchModel): void {
    this.getNewsAndTips(data.ecoNews, data.tips);
    this.itemsFound = data.countOfResults;
  }

  private getNewsAndTips(news, tips): void {
    (news && news.length > 0) ? (this.isNewsSearchFound = true, this.newsElements = news) : (this.isNewsSearchFound = false);
    (tips && tips.length > 0) ? (this.isTipsSearchFound = true, this.tipsElements = tips) : (this.isTipsSearchFound = false);
  }

  private subscribeToSignal(signal: boolean): void {
    this.isSearchClicked = signal;
  }

  private closeSearch(): void {
    this.isSearchClicked = false;
    this.flushData();
  }

  private flushData(): void {
    this.newsElements = null;
    this.tipsElements = null;
    this.isNewsSearchFound = null;
    this.isTipsSearchFound = null;
    this.itemsFound = null;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.signalSubscription.unsubscribe();
  }
}
