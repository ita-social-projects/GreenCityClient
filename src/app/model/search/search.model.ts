import { NewsSearchModel } from './newsSearch.model';
import { TipsSearchModel } from './tipsSearch.model';

export interface SearchModel {
  id: number;
  title: string;
  tags: Array<string>;
  countOfResults: number;
  ecoNews: Array<NewsSearchModel>;
  tipsAndTricks: Array<TipsSearchModel>;
  creationDate: string;
  author: {
    id: number;
    name: string;
  };
}
