import { singleNewsImages } from './../../../../image-pathes/single-news-images';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take, takeUntil } from 'rxjs/operators';

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
  public isLiked: boolean;
  public likesType = {
    like: 'assets/img/comments/like.png',
    liked: 'assets/img/comments/liked.png'
  };

  private newsId: number;
  private newsImage: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private ecoNewsService: EcoNewsService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.canUserEditNews();
    this.setNewsId();
    this.setNewsIdSubscription();
    this.getIsLiked();
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

  public onLikeNews(): void {
    if (this.isLiked) {
      this.isLiked = false;
      this.newsItem.likes = this.newsItem.likes - 1;
      this.postToggleLike();
    } else {
      this.isLiked = true;
      this.newsItem.likes = this.newsItem.likes + 1;
      this.postToggleLike();
    }
  }

  private postToggleLike(): void {
    this.ecoNewsService.postToggleLike(this.newsId);
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
    this.route.paramMap.pipe(takeUntil(this.destroy)).subscribe((params) => {
      this.newsId = +params.get('id');
      this.fetchNewsItem();
    });
  }

  private fetchNewsItem(): void {
    const id = this.newsId.toString();
    this.ecoNewsService
      .getEcoNewsById(id)
      .pipe(takeUntil(this.destroy))
      .subscribe((item: EcoNewsModel) => this.setNewsItem(item));
  }

  private getIsLiked(): void {
    this.ecoNewsService
      .getIsLikedByUser(this.newsId)
      .pipe(take(1))
      .subscribe((val: boolean) => {
        this.isLiked = val;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
