import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { negate, isNil } from 'lodash';

import { SearchService } from '@global-service/search/search.service';
import { SearchModel } from '@global-models/search/search.model';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';
import { TipsSearchModel } from '@global-models/search/tipsSearch.model';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';


@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss'],
})

export class SearchPopupComponent implements OnInit, OnDestroy {
  public isTipsSearchFound: boolean;
  public newsElements: NewsSearchModel[];
  public tipsElements: TipsSearchModel[];
  public isNewsSearchFound: boolean;
  public isSearchClicked = false;
  public itemsFound: number;
  public searchModalSubscription: Subscription;
  public searchInput = new FormControl('');


  constructor(public search: SearchService,
              public dialog: MatDialog,
              private snackBar: MatSnackBarComponent
  ) {}

  ngOnInit() {
    this.setupInitialValue();

    const searchValueChanges$ = this.searchInput.valueChanges;

    searchValueChanges$
      .pipe(filter(Boolean))
      .subscribe((value: string) => {
        this.search.getSearch(value)
          .subscribe(data => this.getSearchData(data),
          (error) => this.openErrorPopup());
    });

    searchValueChanges$
      .pipe(filter(negate(isNil)))
      .subscribe(() => this.resetData());
  }

  public setupInitialValue(): void {
    this.searchModalSubscription = this.search.searchSubject.subscribe(signal => this.subscribeToSignal(signal));
  }

  public openErrorPopup(): void {
    this.snackBar.openSnackBar('error');
  }

  public getAllResults(category: string): void {
    this.search.getAllResults(this.searchInput.value, category);
    this.closeSearch();
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
  }

  ngOnDestroy() {
    this.searchModalSubscription.unsubscribe();
  }
}
