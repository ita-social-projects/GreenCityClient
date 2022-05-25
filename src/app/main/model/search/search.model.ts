import { NewsSearchModel } from './newsSearch.model';

export interface SearchModel {
  countOfResults: number;
  ecoNews: Array<NewsSearchModel>;
}

export interface SearchDataModel {
  currentPage: number;
  totalElements: number;
  totalPages: number;
}
