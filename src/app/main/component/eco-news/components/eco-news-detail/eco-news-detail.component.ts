import { singleNewsImages } from './../../../../image-pathes/single-news-images';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
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
  public userInfo;
  private newsIdSubscription: Subscription;
  private newsItemSubscription: Subscription;
  private newsId: number;
  private newsImage: string;

  constructor(private route: ActivatedRoute, private ecoNewsService: EcoNewsService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.canUserEditNews();
    this.setNewsId();
    this.setNewsIdSubscription();
  }

  public setNewsItem(item: EcoNewsModel): void {
    const nestedNewsItem = { authorId: item.author.id, authorName: item.author.name };
    this.newsItem = { ...item, ...nestedNewsItem };
  }

  public checkNewsImage(): string {
    this.newsImage = this.newsItem.imagePath && this.newsItem.imagePath !== ' ' ? this.newsItem.imagePath : this.images.largeImage;
    return this.newsImage;
  }

  public canUserEditNews(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => (this.userId = id));
  }

  public onSocialShareLinkClick(type: string): void {
    const data = this.shareLinks();
    window.open(data[type](), '_blank');
  }

  private shareLinks() {
    const currentPage: string = window.location.href;

    return {
      fb: () => `https://www.facebook.com/sharer/sharer.php?u=${currentPage}`,
      linkedin: () => `https://www.linkedin.com/sharing/share-offsite/?url=${currentPage}`,
      twitter: () => `https://twitter.com/share?url=${currentPage}&text=${this.newsItem.title}&hashtags=${this.newsItem.tags.join(',')}`
    };
  }

  private setNewsId(): void {
    this.newsId = this.route.snapshot.params.id;
  }

  private setNewsIdSubscription(): void {
    this.newsIdSubscription = this.route.paramMap.subscribe((params) => {
      this.newsId = +params.get('id');
      this.fetchNewsItem();
    });
  }

  private fetchNewsItem(): void {
    const id = this.newsId.toString();
    this.newsItemSubscription = this.ecoNewsService.getEcoNewsById(id).subscribe((item: EcoNewsModel) => this.setNewsItem(item));
  }

  ngOnDestroy() {
    this.newsItemSubscription.unsubscribe();
    this.newsIdSubscription.unsubscribe();
  }
}
