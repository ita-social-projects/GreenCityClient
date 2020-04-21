import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-not-found',
  templateUrl: './search-not-found.component.html',
  styleUrls: ['./search-not-found.component.scss']
})
export class SearchNotFoundComponent implements OnInit {
  @Output() closeFromChild = new EventEmitter();

  private emitClose(): void {
    this.closeFromChild.emit('1');
  }

  constructor() { }

  ngOnInit() {
  }

}
