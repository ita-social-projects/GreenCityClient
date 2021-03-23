import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Friend, UserFriendsInterface } from '../../../../../interface/user/user-friends.interface';

@Component({
  selector: 'app-users-friends',
  templateUrl: './users-friends.component.html',
  styleUrls: ['./users-friends.component.scss']
})
export class UsersFriendsComponent implements OnInit {
  public userFriends: Array<Friend>;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.showUsersFriends();
  }

  public showUsersFriends(): void {
    this.profileService.getUserFriends()
      .subscribe((item: UserFriendsInterface) => {
        this.userFriends = item.pagedFriends.page;
        // just for test
        if (!this.userFriends.length) {
          for (let i = 0; i < 6; i++) {
            this.userFriends.push({
              id: i,
              name: 'friend',
              profilePicturePath: i % 2 ? 'assets/img/kimi.png' : 'assets/img/lewis.png'
            });
          }
        }
      });
  }
}



