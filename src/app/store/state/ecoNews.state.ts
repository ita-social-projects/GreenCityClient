import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

export interface IEcoNewsState {
  ecoNews: EcoNewsDto;
  pages: EcoNewsModel[];
  pageNumber: number;

  ecoNewsByAuthor: EcoNewsDto;
  autorNews: EcoNewsModel[];
  authorNewsPage: number;

  error: string | null;
}

export const initialNewsState: IEcoNewsState = {
  ecoNews: null,
  pages: [],
  pageNumber: 0,

  ecoNewsByAuthor: null,
  autorNews: [],
  authorNewsPage: 0,
  error: null
};
