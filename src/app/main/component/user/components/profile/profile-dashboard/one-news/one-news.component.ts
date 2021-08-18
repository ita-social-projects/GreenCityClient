import { Component, Input } from '@angular/core';
import { NewsModel } from '@global-user/models/news.model';
import { ecoNewsIcons } from 'src/app/main/image-pathes/profile-icons';

@Component({
  selector: 'app-one-news',
  templateUrl: './one-news.component.html',
  styleUrls: ['./one-news.component.scss']
})
export class OneNewsComponent {
  @Input() ecoNewsModel: NewsModel;

  public profileIcons = ecoNewsIcons;
  public newsImage: string;

  public checkNewsImage(): string {
    this.newsImage =
      this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' '
        ? this.ecoNewsModel.imagePath
        : this.profileIcons.newsDefaultPictureProfile;
    return this.newsImage;
  }
}
