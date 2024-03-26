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
  public recommendedFriends: FriendModel[] = [];
  public recommendedFriendsBySearch: FriendModel[] = [];
  public userId: number;
  private destroy$ = new Subject();
  public scroll = false;
  public currentPage = 0;
  public totalPages: number;
  public amountOfFriends: number;
  public isFetching = false;
  public emptySearchList = false;
  public sizePage = 10;
  public searchQuery = '';
  public searchMode = false;

  readonly absent = 'assets/img/noNews.svg';
  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
    private matSnackBar: MatSnackBarComponent,
    private userOnlineStatusService: UserOnlineStatusService
  ) {}

  ngOnInit() {
    this.initUser();
    this.getNewFriends(this.currentPage);
    this.userOnlineStatusService.usersOnlineStatus$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //handle isonline status
    });
  }

  public findUserByName(value: string) {
    this.searchQuery = value;
    this.isFetching = true;
    this.searchMode = true;
    this.userFriendsService
      .getNewFriends(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: FriendArrayModel) => {
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
        (error) => {
          this.matSnackBar.openSnackBar('snack-bar.error.default');
          this.isFetching = false;
          this.searchMode = false;
        }
      );
  }

  public getNewFriends(currentPage: number) {
    this.isFetching = true;
    this.userFriendsService
      .getNewFriends('', currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: FriendArrayModel) => {
          this.totalPages = data.totalPages;
          this.recommendedFriends = this.recommendedFriends.concat(data.page);
          this.userOnlineStatusService.addUsersId(
            UsersCategOnlineStatus.recommendedFriends,
            data.page.map((el) => el.id)
          );
          this.emptySearchList = false;
          this.isFetching = false;
          this.scroll = false;
        },
        (error) => {
          this.matSnackBar.openSnackBar('snack-bar.error.default');
          this.isFetching = false;
        }
      );
  }

  public onScroll(): void {
    if (this.scroll || this.emptySearchList) {
      return;
    }
    this.scroll = true;
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getNewFriends(this.currentPage);
    }
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  ngOnDestroy(): void {
    this.userOnlineStatusService.removeUsersId(UsersCategOnlineStatus.recommendedFriends);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
