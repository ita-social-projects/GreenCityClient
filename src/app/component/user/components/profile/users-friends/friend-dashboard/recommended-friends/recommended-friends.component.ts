import { Component, OnInit } from '@angular/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendModel, FriendRecommendedModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recommended-friends',
  templateUrl: './recommended-friends.component.html',
  styleUrls: ['./recommended-friends.component.scss']
})
export class RecommendedFriendsComponent implements OnInit {

  public recommendedFriends: FriendModel[];
  public userId: number;
  private destroy = new Subject();

  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBarComponent
  ) { }

  ngOnInit() {
    this.initUser();
    this.getRecommendedFriends();
  }

  public addStatus () {
    this.recommendedFriends.forEach( elem => {
      elem.added = false;
    });
  }

  public changeStatus(id) {
    const index = this.recommendedFriends.findIndex(elem => elem.id === id);
    this.recommendedFriends[index].added = !this.recommendedFriends[index].added;
  }

  public getRecommendedFriends () {
    this.userFriendsService.getRecommendedFriends(this.userId).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error.message');
        return error;
      })
    )
    .pipe(
      takeUntil(this.destroy)
    )
    .subscribe (
      (data: FriendRecommendedModel) => {
        this.recommendedFriends = data.page;
        this.addStatus();
      },
    );
  }

  public deleteFriend(id: number) {
    this.userFriendsService.deleteFriend(this.userId, id).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error.message');
        return error;
      })
    )
    .pipe(
      takeUntil(this.destroy)
    )
    .subscribe(
      () => {
        this.changeStatus(id);
        console.log(this.recommendedFriends);
      }
    )
  }

  public addFriend(id: number) {
    this.userFriendsService.addFriend(this.userId, id).pipe(
      catchError((error) => {
        this.snackBar.openSnackBar('error.message');
        return error;
      })
    )
    .pipe(
      takeUntil(this.destroy)
    )
    .subscribe(
      () => {
      this.changeStatus(id);
      }
    )
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
    .pipe(
      takeUntil(this.destroy)
    )
      .subscribe((userId: number) => this.userId = userId);
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
