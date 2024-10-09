import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationArrayModel, NotificationModel } from '@user-models/notification.model';

@Component({
  selector: 'app-user-notifications-pop-up',
  templateUrl: './user-notifications-pop-up.component.html',
  styleUrls: ['./user-notifications-pop-up.component.scss']
})
export class UserNotificationsPopUpComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();
  notifications: NotificationModel[] = [];
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<UserNotificationsPopUpComponent>,
    private userNotificationService: UserNotificationService
  ) {}

  ngOnInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event) => {
        if (event.key === 'Escape') {
          this.closeDialog({ openAll: false });
        }
      });

    this.userNotificationService
      .getThreeNewNotification()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((data: NotificationArrayModel) => {
        this.notifications = data.page;
        this.isLoading = false;
      });
  }

  openAll() {
    this.dialogRef.close({ openAll: true });
  }

  closeDialog(data: { openAll: boolean }) {
    this.dialogRef.close(data);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
