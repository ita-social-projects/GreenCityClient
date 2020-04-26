import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchClickService } from '../../../service/search/search-click.service';
import { SearchService } from '../../../service/search/search.service';
import { SearchModel } from '../../../model/search/search.model';
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
  private searchElements: SearchModel[] = [];
  private itemsFound: number;
  private iterator: number;

  constructor(private clickSearch: SearchClickService,
              private search: SearchService) {}

  ngOnInit() {
    this.signalSubscription = this.clickSearch.openSearchEmitter.subscribe(this.subscribeToSignal.bind(this));
  }

  private onKeyUp(event: any): void {
    this.inputValue = event.target.value;
    this.searchSubscription = this.search.getSearch(this.inputValue).subscribe(this.getSearchData.bind(this));
  }


  private getSearchData(data: SearchModel[]): void {
    if (data.length > 0) {
      this.isNewsSearchFound = true;
      this.searchElements = data;
      this.iterator = data.length;
      this.itemsFound = data.length;
    } else {
      this.isNewsSearchFound = false;
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
