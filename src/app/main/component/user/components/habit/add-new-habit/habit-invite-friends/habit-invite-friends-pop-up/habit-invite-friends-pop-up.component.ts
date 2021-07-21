import { Component, OnInit } from '@angular/core';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';

@Component({
  selector: 'app-habit-invite-friends-pop-up',
  templateUrl: './habit-invite-friends-pop-up.component.html',
  styleUrls: ['./habit-invite-friends-pop-up.component.scss']
})
export class HabitInviteFriendsPopUpComponent implements OnInit {
  userId: number;
  friends: FriendModel[];

  constructor(private userFriendsService: UserFriendsService) {}

  ngOnInit() {
    this.getUserId();
    this.getFriends();
  }

  private getUserId() {
    this.userId = +localStorage.getItem('userId');
  }

  getFriends() {
    this.userFriendsService.getAllFriends(this.userId).subscribe((data: FriendArrayModel) => {
      (this.friends = data.page), console.log(this.friends);
    });
  }
}
