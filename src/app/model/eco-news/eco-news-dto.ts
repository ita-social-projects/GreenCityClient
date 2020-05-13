import {EcoNewsModel} from './eco-news-model';

export interface EcoNewsDto {
  page: Array<EcoNewsModel>;
  totalElements: number;
  currentPage: number;
}
