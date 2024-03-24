import { Injectable, OnDestroy } from '@angular/core';
import { SocketService } from '@global-service/socket/socket.service';
import { UserCateg, UsersCategOnlineStatus } from '@global-user/models/friend.model';
import { BehaviorSubject, Subject, interval, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserOnlineStatusService implements OnDestroy {
  private destroy$ = new Subject();
  public usersToCheckOnlineStatus = {
    [UsersCategOnlineStatus.profile]: [],
    [UsersCategOnlineStatus.allFriends]: [],
    [UsersCategOnlineStatus.recommendedFriends]: [],
    [UsersCategOnlineStatus.friendsRequests]: [],
    [UsersCategOnlineStatus.usersFriends]: [],
    [UsersCategOnlineStatus.mutualFriends]: []
  };
  private timeInterval = 300000;
  public timer$ = interval(this.timeInterval);
  public usersIdToCheck$ = new BehaviorSubject({});
  public usersOnlineStatus$ = new BehaviorSubject({});

  constructor(private socketService: SocketService) {
    this.sendRequestMessage();
    this.subscribeToSocketResponse();
  }

  public sendRequestMessage() {
    merge(this.timer$, this.usersIdToCheck$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const usersIdArray = Object.values(this.usersToCheckOnlineStatus).flat();
        const uniqueIdSet = [...new Set(usersIdArray)];
        console.log('sending message with', uniqueIdSet);
        if (uniqueIdSet.length) {
          this.socketService.send(`/app/isOnline`, { userId: uniqueIdSet });
        }
      });
  }
  public subscribeToSocketResponse(): void {
    this.socketService
      .onMessage(`/topic/${this.socketService.userId}/onlineStatus/`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.usersOnlineStatus$.next(res);
      });
  }

  public addUsersId(type: UserCateg, value: Array<number>): void {
    this.usersToCheckOnlineStatus[type] = [...new Set([...this.usersToCheckOnlineStatus[type], ...value])];
    this.usersIdToCheck$.next(this.usersToCheckOnlineStatus);
  }

  public removeUsersId(type: UserCateg): void {
    this.usersToCheckOnlineStatus[type] = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
