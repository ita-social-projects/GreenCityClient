import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendModel, UsersCategOnlineStatus } from '@global-user/models/friend.model';
import { Subject } from 'rxjs';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { GetAllFriendsRequests } from 'src/app/store/actions/friends.actions';
import { IFriendState } from 'src/app/store/state/friends.state';
import { UserOnlineStatusService } from '@global-user/services/user-online-status.service';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent implements OnInit, OnDestroy {
  public requests: FriendModel[] = [];
  public userId: number;
  private destroy$ = new Subject();
  public scroll: boolean;
  public currentPage = 0;
  private size = 10;
  public totalPages: number;
  friendsStore$ = this.store.select((state: IAppState): IFriendState => state.friend);
  readonly absent = 'assets/img/noNews.svg';

  constructor(
    private localStorageService: LocalStorageService,
    private store: Store,
    private userOnlineStatusService: UserOnlineStatusService
  ) {}

  ngOnInit() {
    this.initUser();
    this.scroll = true;
    this.friendsStore$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data.FriendRequestList) {
        this.requests = data.FriendRequestList;
        this.totalPages = data.FriendRequestState?.totalPages;
        this.userOnlineStatusService.addUsersId(
          UsersCategOnlineStatus.friendsRequests,
          data.FriendRequestList.map((el) => el.id)
        );
      }
      this.scroll = false;
    });
    this.userOnlineStatusService.usersOnlineStatus$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //handle isonline status
    });
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  public onScroll(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage += 1;
      this.scroll = true;
      this.store.dispatch(GetAllFriendsRequests({ page: this.currentPage, size: this.size }));
    }
  }

  ngOnDestroy(): void {
    this.userOnlineStatusService.removeUsersId(UsersCategOnlineStatus.friendsRequests);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
