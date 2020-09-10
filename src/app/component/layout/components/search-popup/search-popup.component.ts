import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { SearchService } from '@global-service/search/search.service';
import { SearchModel } from '@global-models/search/search.model';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';
import { TipsSearchModel } from '@global-models/search/tipsSearch.model';
import { ErrorComponent } from '@global-errors/error/error.component';


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

  constructor(private search: SearchService,
              public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.searchModalSubscription = this.search.searchSubject.subscribe(signal => this.subscribeToSignal(signal));
  }

  public onKeyUp(event: EventTarget): void {
    const VALUE = 'value';
    if (event[VALUE].length > 0) {
      this.inputValue = event[VALUE];
      this.searchSubscription = this.search.getSearch(this.inputValue)
        .subscribe(data => this.getSearchData(data),
          (error) => this.dialog.open(ErrorComponent, {
            hasBackdrop: false,
            closeOnNavigation: true,
            position: { top: '100px' },
            panelClass: 'custom-dialog-container',
          }));
    } else {
      this.resetData();
    }
  }

  private getSearchData(data: SearchModel): void {
    this.getNewsAndTips(data.ecoNews, data.tipsAndTricks);
    this.itemsFound = data.countOfResults;
  }

  private getNewsAndTips(news, tips): void {
    this.isNewsSearchFound = news.length > 0;
    this.isTipsSearchFound = tips.length > 0;
    this.newsElements = news.length > 0 ? news : this.newsElements;
    this.tipsElements = tips.length > 0 ? tips : this.tipsElements;
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
