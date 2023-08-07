import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-all-friends',
  templateUrl: './all-friends.component.html',
  styleUrls: ['./all-friends.component.scss']
})
export class AllFriendsComponent implements OnInit {
  public userId: number;
  public friends: FriendModel[] = [];
  private destroy$ = new Subject();
  public scroll = false;
  public currentPage = 0;
  public totalPages: number;
  public emptySearchList = false;
  public searchQuery = '';
  public isFetching = false;
  public searchMode = false;
  readonly absent = 'assets/img/noNews.svg';

  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
    private matSnackBar: MatSnackBarComponent
  ) {}

  ngOnInit() {
    this.initUser();
    this.getAllFriends(this.currentPage);
  }

  public getAllFriends(currentPage: number) {
    this.isFetching = true;
    this.userFriendsService
      .getAllFriendsAndByName('', currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: FriendArrayModel) => {
          this.totalPages = data.totalPages;
          this.friends = this.friends.concat(data.page);
          this.isFetching = false;
          this.emptySearchList = false;
          this.scroll = false;
        },
        (error) => {
          this.matSnackBar.openSnackBar('snack-bar.error.default');
          this.isFetching = false;
        }
      );
  }

  public findFriendByName(value: string): void {
    this.isFetching = true;
    this.searchQuery = value;
    this.searchMode = true;
    this.userFriendsService
      .getAllFriendsAndByName(value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: FriendArrayModel) => {
          this.emptySearchList = !data.page.length;
          this.friends = data.page;
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

  public deleteFriendsFromList(id, array) {
    const indexDeletedFriend = array.findIndex((item) => item.id === id);
    array.splice(indexDeletedFriend, 1);
  }

  public onScroll(): void {
    if (this.scroll || this.emptySearchList) {
      return;
    }
    this.scroll = true;
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getAllFriends(this.currentPage);
    }
  }

  public handleDeleteFriend(id: number) {
    this.userFriendsService
      .deleteFriend(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.deleteFriendsFromList(id, this.friends);
      });
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }
}
