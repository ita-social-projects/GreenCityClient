import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from 'src/app/service/news/news.service';
import { NewsDto } from 'src/app/service/news/NewsDto';
import { of } from 'rxjs';
import { LanguageService } from 'src/app/i18n/language.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-eco-events',
  templateUrl: './eco-events.component.html',
  styleUrls: ['./eco-events.component.css']
})
export class EcoEventsComponent implements OnInit {
  readonly eventImg = 'assets/img/main-event-placeholder.png';
  readonly arrow = 'assets/img/icon/arrow.png';
  latestNews: NewsDto[] = [];

  constructor(
    private newsService: NewsService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.newsService.loadLatestNews();
    this.newsService.latestNews.pipe(catchError(() => of([]))).subscribe(
      (newsItems: NewsDto[]) => {
        newsItems.forEach(
          (element: NewsDto) => (element.creationDate = this.convertDate(element.creationDate))
        );
        this.latestNews = newsItems;
      },
      error => {
        throw error;
      }
    );
  }

  private convertDate(date: string): string {
    const dateObj = new Date(date);
    const localizedMonth = this.languageService.getLocalizedMonth(
      dateObj.getMonth()
    );
    return (
      dateObj.getDate() +
      ' ' +
      localizedMonth.charAt(0).toUpperCase() +
      localizedMonth.slice(1, localizedMonth.length) +
      ' ' +
      dateObj.getFullYear()
    );
  }
}
