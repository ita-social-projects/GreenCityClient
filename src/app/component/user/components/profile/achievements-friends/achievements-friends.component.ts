import { Component, OnInit } from '@angular/core';
import { PROFILE_IMAGES } from '../../../../../../assets/img/profile/profile-images';

@Component({
  selector: 'app-achievements-friends',
  templateUrl: './achievements-friends.component.html',
  styleUrls: ['./achievements-friends.component.scss']
})
export class AchievementsFriendsComponent implements OnInit {
  private achievementsImages = PROFILE_IMAGES.achs;
  private friendsImages = PROFILE_IMAGES.friends;

  constructor() { }

  ngOnInit() {
  }

}
