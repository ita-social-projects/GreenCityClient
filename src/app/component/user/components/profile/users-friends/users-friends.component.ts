import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';

@Component({
  selector: 'app-users-friends',
  templateUrl: './users-friends.component.html',
  styleUrls: ['./users-friends.component.scss']
})
export class UsersFriendsComponent implements OnInit {
  public usersFriends;
  public noFriends = null;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.showUsersFriends();
  }

  public showUsersFriends(): void {
    this.profileService.getUserFriends()
      .subscribe(item => {
        this.usersFriends = item;
      }, error => {
        this.noFriends = error;
      });
  }
}



