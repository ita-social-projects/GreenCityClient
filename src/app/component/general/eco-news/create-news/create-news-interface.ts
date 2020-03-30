export interface NewsModel {
    text: string;
    title: string;
  }
  
export interface FilterModel {
  name: string;
  isActive: boolean;
}

export interface LanguageModel {
  name: string;
  lang: string;
}

export interface TranslationModel {
  text: string;
  title: string;
}

export interface TranslationDTO {
  language: {
    code: string
  };
  text: string;
  title: string;
}

export interface NewsDTO {
  imagePath: string;
  tags: Array<string>;
  translations: Array<TranslationDTO>;
}