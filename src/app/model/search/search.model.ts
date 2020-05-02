import { NewsSearchModel } from './newsSearch.model';
import { TipsSearchModel } from './tipsSearch.model';

export interface SearchModel {
  ecoNews: Array<NewsSearchModel>;
  tips: Array<TipsSearchModel>;
}
