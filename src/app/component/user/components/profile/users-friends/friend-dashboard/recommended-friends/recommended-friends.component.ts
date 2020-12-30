import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recommended-friends',
  templateUrl: './recommended-friends.component.html',
  styleUrls: ['./recommended-friends.component.scss']
})
export class RecommendedFriendsComponent implements OnInit, OnDestroy {

  public recommendedFriends: FriendModel[];
  public userId: number;
  private destroy$ = new Subject();
  public scroll: boolean;
  public currentPage = 0;
  public totalPages: number;

  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.initUser();
    this.getRecommendedFriends();
  }

  public addStatus(friendArray: FriendModel[]) {
    friendArray.forEach( elem => {
      elem.added = false;
    });
  }

  public changeStatus(id: number, friendArray: FriendModel[]) {
    const index = friendArray.findIndex(elem => elem.id === id);
    friendArray[index].added = !friendArray[index].added;
  }

  public getRecommendedFriends() {
    this.userFriendsService.getRecommendedFriends(this.userId).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe (
      (data: FriendArrayModel) => {
        this.totalPages = data.totalPages;
        this.recommendedFriends = data.page;
        this.addStatus(this.recommendedFriends);
      },
    );
  }

  public onScroll(): void {
    this.scroll = true;
    if ( this.currentPage < this.totalPages ) {
      this.currentPage += 1;
      this.userFriendsService.getRecommendedFriends(this.userId, this.currentPage).pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (data: FriendArrayModel) => {
          this.addStatus(data.page);
          this.recommendedFriends = this.recommendedFriends.concat(data.page);
        },
       );
    }
  }

  public deleteFriend(id: number) {
    this.userFriendsService.deleteFriend(this.userId, id).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      () => {
        this.changeStatus(id, this.recommendedFriends);
      }
    );
  }

  public addFriend(id: number) {
    this.userFriendsService.addFriend(this.userId, id).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      () => {
      this.changeStatus(id, this.recommendedFriends);
      }
    );
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe((userId: number) => this.userId = userId);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
