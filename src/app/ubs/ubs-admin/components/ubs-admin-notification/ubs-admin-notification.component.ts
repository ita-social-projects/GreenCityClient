import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NotificationsService, NotificationTemplate } from '../../services/notifications.service';
import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings/ubs-admin-notification-settings.component';
import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form/ubs-admin-notification-edit-form.component';

@Component({
  selector: 'app-ubs-admin-notification',
  templateUrl: './ubs-admin-notification.component.html',
  styleUrls: ['./ubs-admin-notification.component.scss']
})
export class UbsAdminNotificationComponent implements OnInit, OnDestroy {
  private destroy = new Subject<void>();

  icons = {
    back: 'assets/img/ubs-admin-notifications/back.svg',
    edit: 'assets/img/ubs-admin-notifications/pencil.svg',
    delete: './assets/img/ubs-admin-notifications/trashcan.svg',
    activate: './assets/img/ubs-admin-notifications/counterclockwise.svg'
  };
  lang = 'en';
  initialNotification = null;
  notification = null;

  constructor(
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.lang = lang;
    });
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((params) => {
      const id = Number(params.id);
      this.loadNotification(id);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  loadNotification(id: number): void {
    this.notificationsService
      .getNotificationTemplate(id)
      .pipe(take(1))
      .subscribe(
        (notification: NotificationTemplate) => {
          this.initialNotification = {
            ...notification,
            schedule: notification.schedule?.cron ?? ''
          };
          this.notification = JSON.parse(JSON.stringify(this.initialNotification));
        },
        () => this.navigateToNotificationList()
      );
  }

  navigateToNotificationList(): void {
    this.router.navigate(['../../notifications'], { relativeTo: this.route });
  }

  onGoBack(): void {
    this.location.back();
  }

  onEditNotificationText(platform: string): void {
    this.dialog
      .open(UbsAdminNotificationEditFormComponent, {
        hasBackdrop: true,
        data: { platform, text: this.notification.platforms.find((pf) => pf.name === platform).body }
      })
      .afterClosed()
      .subscribe((updated) => {
        if (!updated) {
          return;
        }
        this.notification.platforms.find((pf) => pf.name === platform).body = updated.text;
      });
  }

  onEditNotificationSettings(): void {
    this.dialog
      .open(UbsAdminNotificationSettingsComponent, {
        hasBackdrop: true,
        data: {
          title: { en: this.notification.title.en, ua: this.notification.title.ua },
          trigger: this.notification.trigger,
          schedule: this.notification.schedule,
          status: this.notification.status
        }
      })
      .afterClosed()
      .subscribe((settings: { title: { en: string; ua: string }; trigger: string; schedule: string }) => {
        this.notification.title = settings.title;
        this.notification.trigger = settings.trigger;
        this.notification.schedule = settings.schedule;
      });
  }

  onActivatePlatform(platform: string): void {
    this.notification.platforms.find((pf) => pf.name === platform).status = 'ACTIVE';
  }

  onDeactivatePlatform(platform: string): void {
    this.notification.platforms.find((pf) => pf.name === platform).status = 'INACTIVE';
  }

  onCancel(): void {
    this.navigateToNotificationList();
  }

  onSaveChanges(): void {}
}
