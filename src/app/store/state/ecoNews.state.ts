import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

export interface IEcoNewsState {
  ecoNews: EcoNewsDto;
  error: string | null;
  page: EcoNewsModel[];
  pageNumber: number;
}

export const initialNewsState: IEcoNewsState = {
  ecoNews: null,
  page: [],
  error: null,
  pageNumber: 0
};
