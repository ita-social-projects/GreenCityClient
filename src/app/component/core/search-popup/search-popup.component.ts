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
    this.inputValue = event.target.value;
    this.searchSubscription = this.search.getSearch(this.inputValue).subscribe(this.getSearchData.bind(this));
  }

  private getSearchData(data: SearchModel): void {
    this.getNews(data.ecoNews);
    if (data.tips) {
      this.getTips(data.tips);
    }
    this.itemsFound = data.countOfResults;
  }

  private getNews(data): void {
    if (data.length > 0) {
      this.isNewsSearchFound = true;
      this.newsElements = data;
    } else {
      this.isNewsSearchFound = false;
    }
  }

  private getTips(data): void {
    if (data.length > 0) {
      this.isTipsSearchFound = true;
      this.tipsElements = data;
    } else {
      this.isTipsSearchFound = false;
    }
  }

  private subscribeToSignal(signal: boolean): void {
    this.isSearchClicked = signal;
  }

  private closeSearch(): void {
    this.isSearchClicked = false;
    this.newsElements = undefined;
    this.tipsElements = undefined;
    this.isNewsSearchFound = undefined;
    this.isTipsSearchFound = undefined;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.signalSubscription.unsubscribe();
  }
}
