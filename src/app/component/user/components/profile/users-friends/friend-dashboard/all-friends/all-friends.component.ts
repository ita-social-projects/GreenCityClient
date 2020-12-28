import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel, } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-friends',
  templateUrl: './all-friends.component.html',
  styleUrls: ['./all-friends.component.scss']
})
export class AllFriendsComponent implements OnInit, OnDestroy {

  public userId: number;
  public Friends: FriendModel[];
  private destroy = new Subject();
  public scroll: boolean;
  public currentPage = 0;
  public totalPages: number;

  constructor(private userFriendsService: UserFriendsService,
              private localStorageService: LocalStorageService,
              private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.initUser();
    this.getAllFriends();
  }

  public addStatus(userArray) {
    userArray.forEach( elem => {
      elem.added = true;
    });
  }

  public changeStatus(id, userArray) {
    const index = userArray.findIndex(elem => elem.id === id);
    userArray[index].added = !userArray[index].added;
    return userArray;
  }

  public getAllFriends() {
    this.userFriendsService.getAllFriends(this.userId).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error.message');
        return error;
      })
    )
    .pipe(
      takeUntil(this.destroy)
    )
    .subscribe (
      (data: FriendArrayModel) => {
        this.Friends = data.page;
        this.addStatus(this.Friends);
      },
    );
  }

  public onScroll(): void {
    this.scroll = true;
    this.currentPage += 1;
    this.userFriendsService.getAllFriends(this.userId, this.currentPage).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error');
        return error;
      })
    )
    .pipe(
      takeUntil(this.destroy)
    )
    .subscribe(
      (data: FriendArrayModel) => {
        this.addStatus(data.page);
        this.Friends = this.Friends.concat(data.page);
      },
     );
  }

  public deleteFriend(id: number) {
    this.userFriendsService.deleteFriend(this.userId, id).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error');
        return error;
      })
    )
    .pipe(
      takeUntil(this.destroy)
    )
    .subscribe(
      () => {
        this.changeStatus(id, this.Friends);
      }
    );
  }

  public addFriend(id: number) {
    this.userFriendsService.addFriend(this.userId, id).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error');
        return error;
      })
    )
    .pipe(
      takeUntil(this.destroy)
    )
    .subscribe(
      () => {
      this.changeStatus(id, this.Friends);
      }
    );
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((userId: number) => this.userId = userId);
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
