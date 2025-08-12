import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { FriendStatusValues, UserDataAsFriend } from 'src/app/greencity/modules/user/models/friend.model';
import { UserFriendsService } from 'src/app/greencity/modules/user/services/user-friends/user-friends.service';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { WarningPopUpComponent } from 'src/app/greencity/shared/components';
import { Subject, take, takeUntil } from 'rxjs';
import {
  AcceptRequest,
  AcceptRequestSuccess,
  DeclineRequest,
  DeclineRequestSuccess,
  DeleteFriend,
  DeleteFriendSuccess,
  FriendsListActions
} from 'src/app/store/actions/friends.actions';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-friendship-buttons',
  templateUrl: './friendship-buttons.component.html',
  styleUrls: ['./friendship-buttons.component.scss']
})
export class FriendshipButtonsComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject();
  currentUserId: number;
  canAddFriend: boolean;
  canDeleteFriend: boolean;
  canCancelRequest: boolean;
  canAcceptDeclineRequest: boolean;

  private dialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true
  };
  private chatDialogConfig = {
    ...this.dialogConfig,
    panelClass: 'custom-dialog-container',
    height: '80vh'
  };
  private confirmDialogConfig = {
    ...this.dialogConfig,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: `profile.friends.unfriend-popup.title`,
      popupConfirm: `profile.friends.unfriend-popup.confirm`,
      popupCancel: `profile.friends.unfriend-popup.cancel`
    }
  };
  @Input() userAsFriend: UserDataAsFriend;

  constructor(
    private readonly store: Store,
    private readonly userFriendsService: UserFriendsService,
    private readonly snackBar: MatSnackBarService,
    private readonly dialog: MatDialog,
    private readonly localStorageService: LocalStorageService,
    private readonly actionsSubj: ActionsSubject
  ) {}

  ngOnInit(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.currentUserId = id;
      this.updateConditions();
    });
    this.subscribeToAction();
  }

  private subscribeToAction(): void {
    this.actionsSubj
      .pipe(ofType(DeleteFriendSuccess, AcceptRequestSuccess, DeclineRequestSuccess), takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data.id === this.userAsFriend.id && data.type === FriendsListActions.AcceptRequestSuccess) {
          this.userAsFriend.friendStatus = FriendStatusValues.FRIEND;
        }
        if (data.id === this.userAsFriend.id && data.type === FriendsListActions.DeclineRequestSuccess) {
          this.userAsFriend.friendStatus = FriendStatusValues.REJECTED;
        }
        if (data.id === this.userAsFriend.id && data.type === FriendsListActions.DeleteFriendSuccess) {
          this.userAsFriend.friendStatus = FriendStatusValues.REJECTED;
          this.userAsFriend.requesterId = null;
          this.userFriendsService.removeFriendSubj$.next(this.userAsFriend.id);
        }

        this.updateConditions();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userAsFriend) {
      this.updateConditions();
    }
  }

  private updateConditions(): void {
    this.canAddFriend =
      this.userAsFriend?.friendStatus === FriendStatusValues.NONE || this.userAsFriend?.friendStatus === FriendStatusValues.REJECTED;
    this.canDeleteFriend = this.userAsFriend?.friendStatus === FriendStatusValues.FRIEND;
    this.canCancelRequest =
      this.userAsFriend?.friendStatus === FriendStatusValues.REQUEST && this.userAsFriend?.requesterId === this.currentUserId;
    this.canAcceptDeclineRequest =
      this.userAsFriend?.friendStatus === FriendStatusValues.REQUEST && this.userAsFriend?.requesterId === this.userAsFriend.id;
  }

  handleAction(event: MouseEvent | KeyboardEvent): void {
    if (event instanceof KeyboardEvent && event.key !== 'Enter') {
      return;
    }
    const target = event.target as HTMLElement;
    switch (target.id) {
      case 'addFriend':
        this.addFriend();
        break;
      case 'cancelRequest':
        this.unsendFriendRequest();
        break;
      case 'deleteFriend':
        this.openConfirmPopup();
        break;
      case 'declineRequest':
        this.store.dispatch(DeclineRequest({ id: this.userAsFriend.id }));
        break;
      case 'acceptRequest':
        this.store.dispatch(AcceptRequest({ id: this.userAsFriend.id }));
        break;
      default:
        break;
    }
  }

  private addFriend(): void {
    this.userFriendsService
      .addFriend(this.userAsFriend.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.openSnackBar('addFriend');
          this.userAsFriend.friendStatus = FriendStatusValues.REQUEST;
          this.userAsFriend.requesterId = this.currentUserId;
          this.updateConditions();
        },
        error: () => {
          this.snackBar.openSnackBar('friendValidation');
        }
      });
  }

  private unsendFriendRequest(): void {
    this.userFriendsService
      .unsendFriendRequest(this.userAsFriend.id)
      .pipe(take(1))
      .subscribe(() => {
        this.snackBar.openSnackBar('cancelRequest');
        this.userAsFriend.friendStatus = null;
        this.userAsFriend.requesterId = null;
        this.updateConditions();
      });
  }

  private openConfirmPopup(): void {
    const dialogRef = this.dialog.open(WarningPopUpComponent, this.confirmDialogConfig);

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (confirm) {
          this.store.dispatch(DeleteFriend({ id: this.userAsFriend.id }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
