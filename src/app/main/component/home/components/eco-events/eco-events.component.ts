import { Component, OnInit } from '@angular/core';

import { NewsDto } from '@home-models/NewsDto';
import { NewsService } from '@global-service/news/news.service';

@Component({
  selector: 'app-eco-events',
  templateUrl: './eco-events.component.html',
  styleUrls: ['./eco-events.component.scss']
})
export class EcoEventsComponent implements OnInit {
  readonly eventImg = 'assets/img/main-event-placeholder.png';
  readonly arrow = 'assets/img/icon/arrow.png';
  public latestNews: NewsDto[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadLatestNews();
  }

  private loadLatestNews(): void {
    this.newsService.loadLatestNews().subscribe(
      (data: NewsDto[]) => {
        this.latestNews = data;
      },
      (error) => {
        throw error;
      }
    );
  }
}
