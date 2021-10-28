import { searchIcons } from '../../main/image-pathes/search-icons';
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-search-not-found',
  templateUrl: './search-not-found.component.html',
  styleUrls: ['./search-not-found.component.scss']
})
export class SearchNotFoundComponent {
  @Output() closeUnsuccessfulSearchResults = new EventEmitter();
  @Input() inputValue;
  images = searchIcons;

  public emitClose(): void {
    this.closeUnsuccessfulSearchResults.emit(true);
  }
}
