import { Component, Input, OnChanges } from '@angular/core';
import { PROFILE_IMAGES } from 'src/app/main/image-pathes/profile-images';

@Component({
  selector: 'app-users-achievements',
  templateUrl: './users-achievements.component.html',
  styleUrls: ['./users-achievements.component.scss']
})
export class UsersAchievementsComponent implements OnChanges {
  public achievementsImages = PROFILE_IMAGES.achs;
  public ukrLang: boolean;
  public engLang: boolean;

  @Input() currLang: string;

  ngOnChanges(): void {
    if (this.currLang === 'en') {
      this.engLang = true;
      this.ukrLang = false;
    } else {
      this.ukrLang = true;
      this.engLang = false;
    }
  }
}
