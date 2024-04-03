import { NewsSearchModel } from './newsSearch.model';
import { TipsSearchModel } from './tipsSearch.model';
import { EventsSearchModel } from './eventsSearch.model';

export interface SearchModel {
  countOfResults: number;
  ecoNews: Array<NewsSearchModel>;
  events: Array<EventsSearchModel>;
  tipsAndTricks: Array<TipsSearchModel>;
}

export interface SearchDataModel {
  currentPage: number;
  page: Array<TipsSearchModel>;
  totalElements: number;
  totalPages: number;
}
