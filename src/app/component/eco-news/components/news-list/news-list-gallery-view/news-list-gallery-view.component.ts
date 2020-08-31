import { Component, Input } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.scss'],
  changeDetection: 0
})
export class NewsListGalleryViewComponent {
  @Input() ecoNewsModel: EcoNewsModel;

  public profileIcons = ecoNewsIcons;
  public newsImage: string;
  public titleHeightOfElement: number;
  public textHeightOfElement: number;

  constructor() {}

  public checkNewsImage(): string {
    return this.newsImage = (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') ?
      this.ecoNewsModel.imagePath : this.profileIcons.newsDefaultPictureList;
  }
}
