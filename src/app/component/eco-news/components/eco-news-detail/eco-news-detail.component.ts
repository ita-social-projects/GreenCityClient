import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EcoNewsService } from '../../services/eco-news.service';
import { EcoNewsModel } from '../../models/eco-news-model';
import { Subscription } from 'rxjs';
import { singleNewsImages } from '@eco-news-images/single-news-images';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-eco-news-detail',
  templateUrl: './eco-news-detail.component.html',
  styleUrls: ['./eco-news-detail.component.scss']
})
export class EcoNewsDetailComponent implements OnInit, OnDestroy {
  public newsItem: EcoNewsModel;
  public images = singleNewsImages;
  public userId: number;
  private newsIdSubscription: Subscription;
  private newsItemSubscription: Subscription;
  private newsId: number;
  private newsImage: string;

  constructor(private route: ActivatedRoute,
              private ecoNewsService: EcoNewsService,
              private localStorageService: LocalStorageService ) { }

  ngOnInit() {
    this.canUserEditNews();
    this.setNewsId();
    this.setNewsIdSubscription();
  }

  public setNewsItem(item: EcoNewsModel): void {
    const nestedNewsItem = { ...item.author };
    this.newsItem = { ...item, ...nestedNewsItem };
  }

  public checkNewsImage(): string {
    return this.newsImage = (this.newsItem.imagePath && this.newsItem.imagePath !== ' ') ?
      this.newsItem.imagePath : this.images.largeImage;
  }

  public canUserEditNews(): void {
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
      .subscribe((item: EcoNewsModel) => this.setNewsItem(item));
  }

  ngOnDestroy() {
    this.newsItemSubscription.unsubscribe();
    this.newsIdSubscription.unsubscribe();
  }
}
