import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EcoNewsService } from '../../services/eco-news.service';
import { EcoNewsModel } from '../../models/eco-news-model';
import { Subscription } from 'rxjs';
import { singleNewsImages } from '../../../../../assets/img/icon/econews/single-news-images';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';

@Component({
  selector: 'app-eco-news-detail',
  templateUrl: './eco-news-detail.component.html',
  styleUrls: ['./eco-news-detail.component.scss']
})
export class EcoNewsDetailComponent implements OnInit, OnDestroy {
  private newsIdSubscription: Subscription;
  private newsItemSubscription: Subscription;
  private newsId: number;
  private newsItem: EcoNewsModel;
  private newsImage: string;
  private images = singleNewsImages;
  private userId: number;

  constructor(private route: ActivatedRoute,
              private ecoNewsService: EcoNewsService,
              private localStorageService: LocalStorageService ) { }

  ngOnInit() {
    this.canUserEditNews();
    this.setNewsId();
    this.setNewsIdSubscription();
  }

  private canUserEditNews(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe(id => this.userId = id);
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

  private checkNewsImage(): string {
    return this.newsImage = (this.newsItem.imagePath && this.newsItem.imagePath !== ' ') ?
      this.newsItem.imagePath : this.images.largeImage;
  }

  ngOnDestroy() {
    this.newsItemSubscription.unsubscribe();
    this.newsIdSubscription.unsubscribe();
  }
}
