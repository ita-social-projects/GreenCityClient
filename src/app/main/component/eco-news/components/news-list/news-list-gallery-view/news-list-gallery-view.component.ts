import { ecoNewsIcons } from './../../../../../image-pathes/profile-icons';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsListGalleryViewComponent {
  @Input() ecoNewsModel: EcoNewsModel;
  public profileIcons = ecoNewsIcons;
  public newsImage: string;
  public likeImg = 'assets/img/comments/like.png';

  constructor(public translate: TranslateService) {}

  public checkNewsImage(): string {
    this.newsImage =
      this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' '
        ? this.ecoNewsModel.imagePath
        : this.profileIcons.newsDefaultPictureList;
    return this.newsImage;
  }
}
