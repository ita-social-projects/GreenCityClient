import { Component, Input } from '@angular/core';
import { NewsModel } from '@global-user/models/news.model';
import { userAssignedCardsIcons } from 'src/app/main/image-pathes/profile-icons';

@Component({
  selector: 'app-one-news',
  templateUrl: './one-news.component.html',
  styleUrls: ['./one-news.component.scss']
})
export class OneNewsComponent {
  @Input() ecoNewsModel: NewsModel;

  public profileIcons = userAssignedCardsIcons;

  public checkNewsImage(): string {
    if (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') {
      return this.ecoNewsModel.imagePath;
    } else {
      return this.profileIcons.newsDefaultPictureProfile;
    }
  }
}
