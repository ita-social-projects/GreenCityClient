export interface NewsInterface {
    text: string;
    title: string;
  }
  
export interface FilterInterface {
  name: string;
  isActive: boolean;
}

export interface LanguageInterface {
  name: string;
  lang: string;
}

export interface TranslationInterface {
  text: string;
  title: string;
}

export interface BodyInterface {
  imagePath: string;
  tags: Array<string>;
  translations: Array<{language: {code: string}, 
                       text: string, 
                       title: string}>;
}