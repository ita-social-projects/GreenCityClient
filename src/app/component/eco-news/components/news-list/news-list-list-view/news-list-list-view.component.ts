import { Component, Input, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { ecoNewsIcons } from 'src/app/image-pathes/profile-icons';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.scss'],
  changeDetection: 0
})
export class NewsListListViewComponent {
  @Input() ecoNewsModel: EcoNewsModel;

  public profileIcons = ecoNewsIcons;
  public newsImage: string;

  constructor() {}

  public checkNewsImage(): string {
    return this.newsImage = (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') ?
                              this.ecoNewsModel.imagePath : this.profileIcons.newsDefaultPictureList;
  }
}
