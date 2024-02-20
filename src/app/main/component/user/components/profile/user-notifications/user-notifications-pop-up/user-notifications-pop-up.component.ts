import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-notifications-pop-up',
  templateUrl: './user-notifications-pop-up.component.html',
  styleUrls: ['./user-notifications-pop-up.component.scss']
})
export class UserNotificationsPopUpComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();
  limitNotifications = 3;
  notifications;

  constructor(public dialogRef: MatDialogRef<UserNotificationsPopUpComponent>, private notificatioService: UserNotificationService) {}

  ngOnInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event) => {
        if (event.key === 'Escape') {
          this.closeDialog({ openAll: false });
        }
      });
    this.dialogRef
      .backdropClick()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.closeDialog({ openAll: false }));

    this.notificatioService
      .getThreeNewNotification()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data) => {
        this.notifications = data;
      });
  }

  openAll() {
    this.dialogRef.close({ openAll: true });
  }

  closeDialog(data: { openAll: boolean }) {
    this.dialogRef.close(data);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
