import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EcoNewsService } from '../../../service/eco-news/eco-news.service';
import { EcoNewsModel } from '../../../model/eco-news/eco-news-model';

@Component({
  selector: 'app-eco-news-detail',
  templateUrl: './eco-news-detail.component.html',
  styleUrls: ['./eco-news-detail.component.css']
})
export class EcoNewsDetailComponent implements OnInit, OnDestroy {
  private newsItemSubscription: Subscription;
  private newsId: number;
  private newsItem: EcoNewsModel;

  constructor(private route: ActivatedRoute,
              private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.newsId = this.route.snapshot.params.id;
    this.fetchNewsItem();
  }

  private fetchNewsItem(): void {
    this.newsItemSubscription = this.ecoNewsService
      .getEcoNewsById(this.newsId)
      .subscribe(this.setNewsItem.bind(this));
  }

  private setNewsItem(item: EcoNewsModel): void {
    this.newsItem = item;
  }

  ngOnDestroy() {
    this.newsItemSubscription.unsubscribe();
  }
}
