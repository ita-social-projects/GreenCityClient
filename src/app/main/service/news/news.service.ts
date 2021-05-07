import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewsDto } from 'src/app/main/component/home/models/NewsDto';
import { Observable } from 'rxjs';
import { latestNewsLink } from 'src/app/main/links';
import { LanguageService } from '../../i18n/language.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient, private languageService: LanguageService) {}

  public loadLatestNews(): Observable<NewsDto[]> {
    const currentLanguage = this.languageService.getCurrentLanguage();

    return this.http.get<NewsDto[]>(`${latestNewsLink}?language=${currentLanguage}`);
  }
}
