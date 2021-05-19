import { PROFILE_IMAGES } from './../../../../../image-pathes/profile-images';
import { Component } from '@angular/core';

@Component({
  selector: 'app-users-achievements',
  templateUrl: './users-achievements.component.html',
  styleUrls: ['./users-achievements.component.scss'],
})
export class UsersAchievementsComponent {
  public achievementsImages = PROFILE_IMAGES.achs;
}
