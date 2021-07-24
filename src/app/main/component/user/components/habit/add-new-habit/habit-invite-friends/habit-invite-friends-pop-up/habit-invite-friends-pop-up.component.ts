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
  allAdd: boolean = false;
  addedFriends: FriendModel[] = [];

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
      this.friends = data.page;
    });
  }

  updateAllAdd() {
    this.allAdd = this.friends != null && this.friends.every((friend) => friend.added);
  }

  someAdd(): boolean {
    if (this.friends == null) {
      return false;
    }
    return this.friends.filter((friend) => friend.added).length > 0 && !this.allAdd;
  }

  setAll(added: boolean) {
    this.allAdd = added;
    if (this.friends == null) {
      return;
    }
    this.friends.forEach((friend) => (friend.added = added));
  }

  setAddedFriends() {
    this.friends.forEach((friend) => (friend.added ? this.userFriendsService.addedFriendsToHabit(friend) : null));
  }

  inviteFriends() {
    this.setAddedFriends();
  }
}
