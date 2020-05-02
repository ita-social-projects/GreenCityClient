import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  private itemsFound = 0;

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
    this.getTricks(data.tips);
  }

  private getNews(data): void {
    if (data.length > 0) {
      this.isNewsSearchFound = true;
      this.newsElements = data;
    } else {
      this.isNewsSearchFound = false;
    }
  }

  private getTricks(data): void {
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
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.signalSubscription.unsubscribe();
  }
}
