import { singleNewsImages } from '../../../../image-pathes/single-news-images';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoNewsState } from 'src/app/store/state/ecoNews.state';

@Component({
  selector: 'app-eco-news-detail',
  templateUrl: './eco-news-detail.component.html',
  styleUrls: ['./eco-news-detail.component.scss']
})
export class EcoNewsDetailComponent implements OnInit, OnDestroy {
  public newsItem: EcoNewsModel;
  public images = singleNewsImages;
  public userId: number;
  public isLiked: boolean;
  public likesType = {
    like: 'assets/img/comments/like.png',
    liked: 'assets/img/comments/liked.png'
  };

  private newsId: number;
  private newsImage: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public backRoute: string;

  ecoNewById$ = this.store.select((state: IAppState): IEcoNewsState => state.ecoNewsState);

  constructor(
    private route: ActivatedRoute,
    private ecoNewsService: EcoNewsService,
    private localStorageService: LocalStorageService,
    private store: Store
  ) {}

  ngOnInit() {
    this.canUserEditNews();
    this.setNewsId();
    this.getIsLiked();
    this.backRoute = this.localStorageService.getPreviousPage();

    this.ecoNewById$.subscribe((value) => {
      if (this.backRoute === '/news') {
        this.newsItem = value.pages.find((item) => item.id === +this.newsId);
      }
      if (this.backRoute === '/profile') {
        this.newsItem = value.autorNews.find((item) => item.id === +this.newsId);
      }
    });
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
    this.ecoNewsService.postToggleLike(this.newsId).pipe(take(1)).subscribe();
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
