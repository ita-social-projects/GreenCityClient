import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NewsDto} from './NewsDto';
import {catchError} from 'rxjs/operators';
import {of, BehaviorSubject} from 'rxjs';
import {latestNewsLink} from 'src/app/links';
import {LanguageService} from '../../i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private dataStore: { latestNews: NewsDto[] } = {latestNews: []};
  private latestNewsSubject = new BehaviorSubject<NewsDto[]>([]);
  readonly latestNews = this.latestNewsSubject.asObservable();

  constructor(private http: HttpClient, private languageService: LanguageService) {
  }

  loadLatestNews() {
    const $http = this.http.get<NewsDto[]>(`${latestNewsLink}?language=${this.languageService.getCurrentLanguage()}`);
    $http.pipe(
      catchError(() => of([]))
    ).subscribe(
      data => {
        this.dataStore.latestNews = data;
        this.latestNewsSubject.next(Object.assign({}, this.dataStore).latestNews);
      },
      error => {
        throw error;
      }
    );
  }
}
