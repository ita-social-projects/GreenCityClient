import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { Subject } from 'rxjs';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { GetAllFriendsRequests } from 'src/app/store/actions/friends.actions';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent implements OnInit {
  public requests: FriendModel[] = [];
  public userId: number;
  private destroy$ = new Subject();
  public scroll: boolean;
  public currentPage = 0;
  private size = 10;
  public totalPages: number;
  friendRequestList$ = this.store.select((state: IAppState): FriendModel[] => state.friend.FriendRequestList);
  friendRequestState$ = this.store.select((state: IAppState): FriendArrayModel => state.friend.FriendRequestState);
  readonly absent = 'assets/img/noNews.svg';

  constructor(private localStorageService: LocalStorageService, private userFriendsService: UserFriendsService, private store: Store) {}

  ngOnInit() {
    this.initUser();
    this.friendRequestList$.pipe(takeUntil(this.destroy$)).subscribe((data: FriendModel[]) => {
      if (data) {
        this.requests = data;
        this.scroll = false;
      }
    });
    this.friendRequestState$.pipe(takeUntil(this.destroy$)).subscribe((data: FriendArrayModel) => {
      if (data) {
        this.totalPages = data.totalPages;
      }
    });
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  public onScroll(): void {
    this.scroll = true;
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage += 1;
      this.store.dispatch(GetAllFriendsRequests({ page: this.currentPage, size: this.size }));
    }
  }
}
