import {Component, Input, OnInit} from '@angular/core';
import {SearchClickService} from '../../../service/search-click/search-click.service';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})
export class SearchPopupComponent implements OnInit {
  private _isSearchClicked = false;
  private isSearchFound: boolean = true;

  set isSearchClicked(value: boolean) {
    this.onSearchClick();
    this._isSearchClicked = value;
  }

  get isSearchClicked(): boolean {
    return this._isSearchClicked;
  }

  private onSearchClick(): void {
    document.body.style.overflow = 'hidden';
  }

  private closeSearch(): void {
    this.isSearchClicked = false;
    document.body.style.overflow = 'visible';
  }

  constructor(private clickSearch: SearchClickService) {
    this.clickSearch.emitter.subscribe(signal => this.isSearchClicked = signal);
  }

  ngOnInit() {
  }
}
