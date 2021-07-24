import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { HabitInviteFriendsPopUpComponent } from './habit-invite-friends-pop-up/habit-invite-friends-pop-up.component';

@Component({
  selector: 'app-habit-invite-friends',
  templateUrl: './habit-invite-friends.component.html',
  styleUrls: ['./habit-invite-friends.component.scss']
})
export class HabitInviteFriendsComponent {
  userId: number;
  addedFriends: FriendModel[] = [];

  constructor(private userFriendsService: UserFriendsService, private dialog: MatDialog) {}

  openInviteFriendsDialog() {
    this.dialog.open(HabitInviteFriendsPopUpComponent, {
      hasBackdrop: true
    });
    this.dialog.afterAllClosed.subscribe(() => this.getAddedFriends());
  }

  getAddedFriends() {
    this.addedFriends = this.userFriendsService.addedFriends;
  }
}
