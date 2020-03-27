import { Injectable } from '@angular/core';
import { CreateNewsInterface } from '../../component/general/eco-news/create-news/create-news-interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateEcoNewsService {

  constructor(private http: HttpClient) { }

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
  };

  private url: string = 'https://greencity.azurewebsites.net/econews';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  public getTranslationByLang(lang: string): CreateNewsInterface {
    return this.translations[lang];
  }

  public setTranslationByLang(language: string, translations: CreateNewsInterface): void {
    this.translations[language].text = translations.text;
    this.translations[language].title = translations.title;
  }

  public sendFormData(form): Observable<any> {
    const body: object = {
      "imagePath": form.value.source,
      "tags": [
        "news"
      ],
      "translations": [
        {
          "language": {
            "code": "en"
          },
          "text": form.value.content,
          "title": form.value.title
        }
      ]
    };
    this.httpOptions.headers =
    this.httpOptions.headers.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrb3JhdDMyMjc1QGZmdC1tYWlsLmNvbSIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE1ODUzMjMxNDEsImV4cCI6MTU4NTMzMDM0MX0.2RmfgQhs4tp9uYyXj0AEddaf3sTzK5kjZrx3UtQF1KQ');
    return this.http.post(this.url, body, this.httpOptions);
  }
}
