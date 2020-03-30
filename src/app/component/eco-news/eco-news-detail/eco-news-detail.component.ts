import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EcoNewsService } from '../../../service/eco-news/eco-news.service';
import { EcoNewsModel } from '../../../model/eco-news/eco-news-model';
import { Subscription } from 'rxjs';
import { singleNewsImages } from '../../../../assets/img/icon/econews/single-news-images';

@Component({
  selector: 'app-eco-news-detail',
  templateUrl: './eco-news-detail.component.html',
  styleUrls: ['./eco-news-detail.component.css']
})
export class EcoNewsDetailComponent implements OnInit, OnDestroy {
  private newsIdSubscription: Subscription;
  private newsItemSubscription: Subscription;
  private newsId: number;
  private newsItem: EcoNewsModel;
  private images = singleNewsImages;

  constructor(private route: ActivatedRoute,
              private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.setNewsId();
    this.setNewsIdSubscription();
  }

  private setNewsId(): void {
    this.newsId = this.route.snapshot.params.id;
  }

  private setNewsIdSubscription(): void {
    this.newsIdSubscription = this.route.paramMap
      .subscribe(params => {
        this.newsId = +params.get('id');
        this.fetchNewsItem();
    });
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
    this.newsIdSubscription.unsubscribe();
  }
}
