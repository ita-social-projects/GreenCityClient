import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ecoNewsIcons } from '../../../../../../assets/img/icon/econews/profile-icons';
import { SearchModel } from '../../../../../model/search/search.model';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})

export class SearchItemComponent implements OnInit {
  @Input() searchModel: SearchModel;
  @Output() closeSearch: EventEmitter<boolean> = new EventEmitter();
  profileIcons = ecoNewsIcons;

  private emitCloseSearch(): void {
    this.closeSearch.emit();
  }

  constructor() { }

  ngOnInit() {}

}
