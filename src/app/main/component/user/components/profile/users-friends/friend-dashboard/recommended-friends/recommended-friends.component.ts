import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel, UsersCategOnlineStatus } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UserOnlineStatusService } from '@global-user/services/user-online-status.service';

@Component({
  selector: 'app-recommended-friends',
  templateUrl: './recommended-friends.component.html',
  styleUrls: ['./recommended-friends.component.scss']
})
export class RecommendedFriendsComponent implements OnInit, OnDestroy {
  recommendedFriends: FriendModel[] = [];
  recommendedFriendsBySearch: FriendModel[] = [];
  userId: number;
  private destroy$ = new Subject();
  scroll = false;
  currentPage = 0;
  totalPages: number;
  amountOfFriends: number;
  isFetching = false;
  emptySearchList = false;
  sizePage = 10;
  searchQuery = '';
  searchMode = false;

  readonly absent = 'assets/img/noNews.svg';
  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
    private matSnackBar: MatSnackBarComponent,
    private userOnlineStatusService: UserOnlineStatusService
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.getNewFriends();
    this.userFriendsService.removeFriendSubj$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.onScroll();
    });
  }

  findUserByName(value: string): void {
    this.searchQuery = value;
    this.isFetching = true;
    this.searchMode = true;
    this.userFriendsService
      .getNewFriends(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: FriendArrayModel) => {
          this.emptySearchList = !data.page.length;
          this.recommendedFriendsBySearch = data.page;
          this.userOnlineStatusService.removeUsersId(UsersCategOnlineStatus.recommendedFriends);
          this.userOnlineStatusService.addUsersId(
            UsersCategOnlineStatus.recommendedFriends,
            data.page.map((el) => el.id)
          );
          this.amountOfFriends = this.recommendedFriendsBySearch.length;
          this.isFetching = false;
          this.searchMode = false;
        },
        error: () => {
          this.matSnackBar.openSnackBar('snack-bar.error.default');
          this.isFetching = false;
          this.searchMode = false;
        }
      });
  }

  getNewFriends(): void {
    this.isFetching = true;
    this.userFriendsService.getAllRecommendedFriends(this.currentPage, this.sizePage).subscribe((data: FriendArrayModel) => {
      this.recommendedFriends = [...this.recommendedFriends, ...data.page];
      this.totalPages = data.totalPages;
      this.userOnlineStatusService.addUsersId(
        UsersCategOnlineStatus.recommendedFriends,
        data.page.map((el) => el.id)
      );
      this.emptySearchList = false;
      this.isFetching = false;
      this.scroll = false;
    });
  }

  onScroll(): void {
    if (this.scroll || this.emptySearchList) {
      return;
    }
    this.scroll = true;

    if (this.currentPage < this.totalPages - 1) {
      this.currentPage += 1;
      this.getNewFriends();
    }
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  ngOnDestroy(): void {
    this.userOnlineStatusService.removeUsersId(UsersCategOnlineStatus.recommendedFriends);
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
