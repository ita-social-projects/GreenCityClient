import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-friends',
  templateUrl: './all-friends.component.html',
  styleUrls: ['./all-friends.component.scss']
})
export class AllFriendsComponent implements OnInit, OnDestroy {

  public userId: number;
  public Friends: FriendModel[];
  private destroy$ = new Subject();
  public scroll: boolean;
  public currentPage = 0;
  public totalPages: number;

  constructor(private userFriendsService: UserFriendsService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.initUser();
    this.getAllFriends();
  }

  public getAllFriends() {
    this.userFriendsService.getAllFriends(this.userId).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe (
      (data: FriendArrayModel) => {
        this.Friends = data.page;
      },
    );
  }

  public deleteFriendsFromList(id, array) {
    const i = array.findIndex(item => item.id === id);
    array.splice(i, 1);
  }

  public onScroll(): void {
    this.scroll = true;
    this.currentPage += 1;
    this.userFriendsService.getAllFriends(this.userId, this.currentPage).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      (data: FriendArrayModel) => {
        this.Friends = this.Friends.concat(data.page);
      },
     );
  }

  public handleDeleteFriend(id: number) {
    this.userFriendsService.deleteFriend(this.userId, id).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      () => {
        this.deleteFriendsFromList(id, this.Friends);
      }
    );
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((userId: number) => this.userId = userId);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
