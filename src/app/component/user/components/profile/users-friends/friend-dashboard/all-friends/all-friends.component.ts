import { Component, OnInit } from '@angular/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-all-friends',
  templateUrl: './all-friends.component.html',
  styleUrls: ['./all-friends.component.scss']
})
export class AllFriendsComponent implements OnInit {

  public userId: number;
  public sixFriends: FriendModel[];

  constructor(private userFriendsService: UserFriendsService,
              private localStorageService: LocalStorageService,
              private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.initUser();
    this.getSixFriends();
  }

  public addStatus () {
    this.sixFriends.forEach( elem => {
      elem.added = true;
    });
  }

  public changeStatus(id) {
    const index = this.sixFriends.findIndex(elem => elem.id === id);
    this.sixFriends[index].added = !this.sixFriends[index].added;
  }

  public getSixFriends () {
    this.userFriendsService.getFriends(this.userId).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error');
        return error;
      })
    )
    .subscribe (
      (data: FriendModel[]) => {
        this.sixFriends = data;
        this.addStatus();
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
    .subscribe(
      () => {
        this.changeStatus(id);
        console.log(this.sixFriends);
      }
    )
  }

  public addFriend(id: number) {
    this.userFriendsService.addFriend(this.userId, id).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error');
        return error;
      })
    )
    .subscribe(
      () => {
      this.changeStatus(id);
      console.log(this.sixFriends);
      }
    )
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe((userId: number) => this.userId = userId);
  }
}
