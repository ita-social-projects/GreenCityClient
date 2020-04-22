import { Component, Input, OnInit } from '@angular/core';
import { SearchClickService } from '../../../service/search-click/search-click.service';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})
export class SearchPopupComponent implements OnInit {
  private isSearchClicked = false;
  private isSearchFound: boolean = true;

  private closeSearch(): void {
    this.isSearchClicked = false;
  }

  constructor(private clickSearch: SearchClickService) {
    this.clickSearch.openSearchEmitter.subscribe(signal => this.isSearchClicked = signal);
  }

  ngOnInit() {
  }
}
