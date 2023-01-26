import { ecoNewsIcons } from '../../../../../image-pathes/profile-icons';
import { Component, Input, ChangeDetectionStrategy, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsListGalleryViewComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() ecoNewsModel: EcoNewsModel;
  @Input() ecoNewsText;
  @ViewChild('ecoNewsText', { static: true }) text;

  public profileIcons = ecoNewsIcons;
  public newsImage: string;
  public likeImg = 'assets/img/comments/like.png';
  public tags: Array<string>;
  public currentLang: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(public translate: TranslateService, private localStorageService: LocalStorageService) {}
  ngOnInit() {
    this.currentLang = this.localStorageService.getCurrentLanguage();
    this.tags = this.getLangValue(this.ecoNewsModel.tagsUa, this.ecoNewsModel.tagsEn);
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.tags = this.getLangValue(this.ecoNewsModel.tagsUa, this.ecoNewsModel.tagsEn);
    });
  }

  private getLangValue(uaValue: string[], enValue: string[]): string[] {
    return this.currentLang === 'ua' ? uaValue : enValue;
  }

  public checkNewsImage(): string {
    this.newsImage =
      this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' '
        ? this.ecoNewsModel.imagePath
        : this.profileIcons.newsDefaultPictureList;
    return this.newsImage;
  }

  ngAfterViewInit() {
    this.text.nativeElement.innerHTML = this.ecoNewsModel.content;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
