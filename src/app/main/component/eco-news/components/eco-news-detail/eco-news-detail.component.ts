import { singleNewsImages } from '../../../../image-pathes/single-news-images';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take, takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { Store } from '@ngrx/store';
import { DeleteEcoNewsAction } from 'src/app/store/actions/ecoNews.actions';

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
  public tags: Array<string>;
  public currentLang: string;
  public likesType = {
    like: 'assets/img/comments/like.png',
    liked: 'assets/img/comments/liked.png'
  };

  public newsId: number;
  private newsImage: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public backRoute: string;
  public routedFromProfile: boolean;
  private deleteDialogData = {
    popupTitle: 'homepage.eco-news.news-delete-popup.delete-title',
    popupConfirm: 'homepage.eco-news.news-delete-popup.delete-yes',
    popupCancel: 'homepage.eco-news.news-delete-popup.delete-no',
    style: 'red'
  };
  private isPosting: boolean;

  constructor(
    private route: ActivatedRoute,
    private ecoNewsService: EcoNewsService,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit() {
    this.getUserId();
    this.setNewsId();
    if (this.userId) {
      this.getIsLiked();
    }
    if (this.newsId) {
      this.getEcoNewsById(this.newsId);
    }
    this.routedFromProfile = this.localStorageService.getPreviousPage() === '/profile';
    this.backRoute = this.localStorageService.getPreviousPage();
    this.currentLang = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.tags = this.getAllTags();
    });
  }

  public getEcoNewsById(id: number): void {
    this.ecoNewsService.getEcoNewsById(id).subscribe((res: EcoNewsModel) => {
      this.newsItem = res;
      this.tags = this.getAllTags();
    });
  }
  public getAllTags(): Array<string> {
    return this.langService.getLangValue(this.newsItem.tagsUa, this.newsItem.tags) as string[];
  }

  public checkNewsImage(): string {
    this.newsImage = this.newsItem.imagePath && this.newsItem.imagePath !== ' ' ? this.newsItem.imagePath : this.images.largeImage;
    return this.newsImage;
  }

  public getUserId(): void {
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
    const currentPage: string = window.location.href.replace('#', '%23');
    return {
      fb: () => `https://www.facebook.com/sharer/sharer.php?u=${currentPage}`,
      linkedin: () => `https://www.linkedin.com/sharing/share-offsite/?url=${currentPage}`,
      twitter: () => `https://twitter.com/share?url=${currentPage}&text=${this.newsItem.title}&hashtags=${this.tags.join(',')}`
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

  public deleteNews(): void {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.deleteDialogData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: '',
      width: '300px'
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.store.dispatch(DeleteEcoNewsAction({ id: this.newsId }));
          this.isPosting = true;
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
