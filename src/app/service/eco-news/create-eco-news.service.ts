import { Injectable } from '@angular/core';
import { CreateNewsInterface } from '../../component/general/eco-news/create-news/create-news-interface';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {

  constructor() { }

  public translations = {
    'ua': {
      text: "",
      title: ""
    },
    'ru': {
      text: "",
      title: ""
    },
    'en': {
      text: "",
      title: ""
    }
  }

  public getTranslationByLang(lang: string): CreateNewsInterface {
    return this.translations[lang];
  }

  public setTranslationByLang(language: string, translations: CreateNewsInterface): void {
    this.translations[language].text = translations.text;
    this.translations[language].title = translations.title;
  }
}
