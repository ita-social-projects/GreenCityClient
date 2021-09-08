import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-habit-invite-friends-pop-up',
  templateUrl: './habit-invite-friends-pop-up.component.html',
  styleUrls: ['./habit-invite-friends-pop-up.component.scss']
})
export class HabitInviteFriendsPopUpComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  userId: number;
  friends: FriendModel[];
  allAdd = false;
  addedFriends: FriendModel[] = [];

  constructor(private userFriendsService: UserFriendsService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.getUserId();
    this.getFriends();
  }

  private getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  getFriends() {
    this.userFriendsService
      .getAllFriends(this.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: FriendArrayModel) => {
        this.friends = data.page;
      });
  }

  updateAllAdd() {
    this.allAdd = this.friends !== null && this.friends.every((friend) => friend.added);
  }

  someAdd(): boolean {
    if (this.friends) {
      return this.friends.filter((friend) => friend.added).length > 0 && !this.allAdd;
    }
  }

  setAll(added: boolean) {
    this.allAdd = added;
    if (this.friends) {
      return this.friends.map((friend) => (friend.added = added));
    }
  }

  setAddedFriends() {
    return this.friends.map((friend) => {
      if (friend.added) {
        this.userFriendsService.addedFriendsToHabit(friend);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
