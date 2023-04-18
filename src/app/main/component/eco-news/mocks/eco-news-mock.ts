import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

export const FIRSTECONEWS: EcoNewsModel = {
  author: { id: 1601, name: 'Hryshko' },
  creationDate: '2020-10-26T16:43:29.336931Z',
  id: 4705,
  imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
  tags: ['Events', 'Education'],
  tagsEn: ['Events', 'Education'],
  tagsUa: ['Події', 'Освіта'],
  content: 'hellohellohellohellohellohellohellohellohellohello',
  title: 'hello',
  likes: 0,
  countComments: 2,
  shortInfo: 'info',
  source: null
};

export const ECONEWSMOCK: EcoNewsDto = {
  page: [FIRSTECONEWS],
  totalElements: 1,
  currentPage: 1,
  totalPages: 1,
  hasNext: false
};
