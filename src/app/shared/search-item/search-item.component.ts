import { userAssignedCardsIcons } from '../../main/image-pathes/profile-icons';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent {
  @Input() searchModel: NewsSearchModel;
  @Output() closeSearch: EventEmitter<boolean> = new EventEmitter();
  profileIcons = userAssignedCardsIcons;

  public emitCloseSearch(): void {
    this.closeSearch.emit();
  }
}
