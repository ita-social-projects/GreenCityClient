import { SafeUrl } from '@angular/platform-browser';
import { TagInterface } from 'src/app/greencity/shared/components/tag-filter/tag-filter.model';

export interface NewsModel {
  text: string;
  title: string;
}

export interface TranslationModel {
  text: string;
  title: string;
}

export interface TranslationDTO {
  language: {
    code: string;
  };
  text: string;
  title: string;
}

export interface NewsDTO {
  id?: string;
  tags: Array<TagInterface>;
  text: string;
  title: string;
  source: string;
  image?: SafeUrl;
  content?: string;
  countOfEcoNews: number;
}

export interface NewsResponseDTO {
  id: number;
  title: string;
  text: string;
  ecoNewsAuthorDto: { id: number; firstName: string; lastName: string };
  creationDate: string;
  imagePath: string;
  tags: Array<string>;
}

export interface QueryParams {
  id: number;
}

export interface TextAreasHeight {
  minTextAreaScrollHeight: number;
  maxTextAreaScrollHeight: number;
  minTextAreaHeight: string;
  maxTextAreaHeight: string;
}
