import { Component, OnInit } from '@angular/core';
import { PROFILE_IMAGES } from '../../../../../../assets/img/profile/profile-images';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';

@Component({
  selector: 'app-achievements-friends',
  templateUrl: './achievements-friends.component.html',
  styleUrls: ['./achievements-friends.component.scss']
})
export class AchievementsFriendsComponent implements OnInit {
  private achievementsImages = PROFILE_IMAGES.achs;
  public usersFriends;
  public error = null;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.showUsersFriends();
  }

  public showUsersFriends(): void {
    this.profileService.getUserFriends()
      .subscribe(item => {
        this.usersFriends = item;
      }, error => {
        this.error = error;
      });
  }
}
