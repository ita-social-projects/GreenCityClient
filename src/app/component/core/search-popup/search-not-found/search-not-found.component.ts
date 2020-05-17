import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-not-found',
  templateUrl: './search-not-found.component.html',
  styleUrls: ['./search-not-found.component.scss']
})
export class SearchNotFoundComponent implements OnInit {
  @Output() closeUnsuccessfulSearchResults  = new EventEmitter();

  private emitClose(): void {
    this.closeUnsuccessfulSearchResults.emit(true);
  }

  constructor() { }

  ngOnInit() {
  }

}
