import { Injectable } from '@angular/core';

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

  public getTranslationByLang(lang: string): {text: string, title: string } {
    return this.translations[lang];
  }

  public setTranslationByLang(language: string, translations: {text: string, title: string}): void {
    this.translations[language].text = translations.text;
    this.translations[language].title = translations.title;
  }
}
