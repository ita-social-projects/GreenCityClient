import { userAssignedCardsIcons } from '../../image-paths/profile-icons';
import { NewsSearchModel } from 'src/app/greencity/components/search-popup/model/newsSearch.model';
import { EventsSearchModel } from 'src/app/greencity/components/search-popup/model/eventsSearch.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlacesSearchModel } from 'src/app/greencity/components/search-popup/model/placesSearch.model';
import { CommonSearchModel } from './search-item.model';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.scss']
})
export class SearchItemComponent implements OnInit {
  @Input() searchModel: NewsSearchModel | EventsSearchModel | PlacesSearchModel;
  @Input() type: string;
  @Output() closeSearch: EventEmitter<boolean> = new EventEmitter();
  profileIcons = userAssignedCardsIcons;

  commonModel: CommonSearchModel;
  itemLink: (string | number)[];

  ngOnInit(): void {
    this.commonModel = this.convertToCommonModel(this.searchModel);
    this.itemLink = ['/' + this.type];
    if (this.type !== 'places') {
      this.itemLink.push(this.searchModel.id);
    }
  }

  private convertToCommonModel(model: NewsSearchModel | EventsSearchModel | PlacesSearchModel): CommonSearchModel {
    if ('tags' in model) {
      return {
        id: model.id,
        title: model.title,
        tagsOrCategory: model.tags
      };
    } else {
      return {
        id: model.id,
        title: model.name,
        tagsOrCategory: [model.category]
      };
    }
  }
}
