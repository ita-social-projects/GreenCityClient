import { NewsSearchModel } from './newsSearch.model';
import { TipsSearchModel } from './tipsSearch.model';

export interface SearchModel {
  countOfResults: number;
  ecoNews: Array<NewsSearchModel>;
  tips: Array<TipsSearchModel>;
}
