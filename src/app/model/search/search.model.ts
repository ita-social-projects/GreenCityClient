import { NewsSearchModel } from './newsSearch.model';
import { TipsSearchModel } from './tipsSearch.model';

export interface SearchModel {
  countOfResults: number;
  ecoNews: Array<NewsSearchModel>;
  tipsAndTricks: Array<TipsSearchModel>;
}

export interface SearchDataModel {
  currentPage: number;
  page: Array<TipsSearchModel>;
  totalElements: number;
  totalPages: number;
}
