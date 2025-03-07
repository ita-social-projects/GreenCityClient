import { EventsSearchModel } from 'src/app/greencity/components/search-popup/model/eventsSearch.model';
import { NewsSearchModel } from 'src/app/greencity/components/search-popup/model/newsSearch.model';
import { PlacesSearchModel } from 'src/app/greencity/components/search-popup/model/placesSearch.model';
import { SearchDataModel } from 'src/app/greencity/components/search-popup/model/search.model';

export interface PopupSearchResults {
  news: SearchDataModel<NewsSearchModel>;
  events: SearchDataModel<EventsSearchModel>;
  places: SearchDataModel<PlacesSearchModel>;
}
