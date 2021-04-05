import { Component, OnInit } from '@angular/core';
import { NewsDto } from 'src/app/component/home/models/NewsDto';
import { NewsService } from 'src/app/service/news/news.service';
import { LanguageService } from 'src/app/i18n/language.service';

@Component({
  selector: 'app-eco-events',
  templateUrl: './eco-events.component.html',
  styleUrls: ['./eco-events.component.scss']
})
export class EcoEventsComponent implements OnInit {
  readonly eventImg = 'assets/img/main-event-placeholder.png';
  readonly arrow = 'assets/img/icon/arrow.png';
  public latestNews: NewsDto[] = [];

  constructor(
    private newsService: NewsService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadLatestNews();
  }

  private loadLatestNews(): void {
    this.newsService.loadLatestNews()
      .subscribe((data: NewsDto[]) => {
          this.latestNews = data.map(
            (element: NewsDto) => ({...element, creationDate: this.convertDate(element.creationDate)})
          );
        },
        error => {
          throw error;
        });
  }

  private convertDate(date: string): string {
    const dateObj = new Date(date);
    const localizedMonth = this.languageService.getLocalizedMonth(
      dateObj.getMonth()
    );
    const upper = localizedMonth.charAt(0).toUpperCase();
    const lower = localizedMonth.slice(1, localizedMonth.length);

    return (`${dateObj.getDate()} ${upper}${lower} ${dateObj.getFullYear()}`);
  }
}
