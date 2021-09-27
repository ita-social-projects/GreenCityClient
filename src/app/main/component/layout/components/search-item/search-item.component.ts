import { ecoNewsIcons } from './../../../../image-pathes/profile-icons';
import { NewsSearchModel } from './../../../../model/search/newsSearch.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent {
  @Input() searchModel: NewsSearchModel;
  @Output() closeSearch: EventEmitter<boolean> = new EventEmitter();
  profileIcons = ecoNewsIcons;

  public emitCloseSearch(): void {
    this.closeSearch.emit();
  }
}
