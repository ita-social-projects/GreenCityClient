import { Injectable } from '@angular/core';
import { NewsModel, TranslationModel, NewsDTO, NewsResponseDTO } from '../../component/eco-news/create-news/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {
  private currentForm: FormGroup;
  private currentLang: string;
  private url: string = environment.backendLink;
  private accessToken: string = localStorage.getItem('accessToken');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };
  public translations: {ua: TranslationModel,
                        ru: TranslationModel,
                        en: TranslationModel, imagePath: string} = {
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
    },

    imagePath: ""
  };


  constructor(private http: HttpClient) { }

  public getTranslationByLang(lang: string): NewsModel {
    return this.translations[lang];
  }

  public setTranslationByLang(language: string, translations: NewsModel): void {
    this.translations[language].text = translations.text;
    this.translations[language].title = translations.title;
  }

  public getFormData(): FormGroup {
    this.setTranslationByLang(this.currentLang, {
                              text: this.currentForm.value.content,
                              title: this.currentForm.value.title
    });

    return this.currentForm;
  }

  public setForm(form: FormGroup): void {
    this.currentForm = form;
  }

  public setLang(lang: string): void {
    this.currentLang = lang;
  }

  public getLang(): string {
    return this.currentLang;
  }

  public sendFormData(form, language): Observable<NewsResponseDTO> {
    const body: NewsDTO = {
      "imagePath": form.value.source,
      "tags": form.value.tags,
      "translations": [
        {
          "language": {
            "code": language
          },
          "text": form.value.content,
          "title": form.value.title
        }
      ]
    };

    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    return this.http.post<NewsResponseDTO>(`${this.url}/econews`, body, this.httpOptions);
  }
}
