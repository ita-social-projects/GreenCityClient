import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';
import { SearchModel } from '@global-models/search/search.model';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})

export class SearchItemComponent implements OnInit {
  @Input() searchModel: SearchModel;
  @Output() closeSearch: EventEmitter<boolean> = new EventEmitter();
  profileIcons = ecoNewsIcons;

  public emitCloseSearch(): void {
    this.closeSearch.emit();
  }

  constructor() { }

  ngOnInit() {}

}
