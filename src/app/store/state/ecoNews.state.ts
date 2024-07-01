import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

export interface IEcoNewsState {
  ecoNews: EcoNewsDto;
  pages: EcoNewsModel[];
  pageNumber: number;

  ecoNewsByAuthor: EcoNewsDto;
  authorNews: EcoNewsModel[];
  authorNewsPage: number;
  countOfEcoNews: number;

  error: string | null;
}

export const initialNewsState: IEcoNewsState = {
  ecoNews: null,
  pages: [],
  pageNumber: 0,

  ecoNewsByAuthor: null,
  authorNews: [],
  authorNewsPage: 0,
  error: null,
  countOfEcoNews: 0
};
