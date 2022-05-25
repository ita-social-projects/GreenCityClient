import { NewsSearchModel } from './newsSearch.model';

export interface SearchModel {
  countOfResults: number;
  ecoNews: Array<NewsSearchModel>;
}

export interface SearchDataModel {
  currentPage: number;
  page: Array<TipsSearchModel>;
  totalElements: number;
  totalPages: number;
}
