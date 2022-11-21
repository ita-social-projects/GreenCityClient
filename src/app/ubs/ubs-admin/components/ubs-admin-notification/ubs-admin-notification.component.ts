import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NotificationsService } from '../../services/notifications.service';
import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings/ubs-admin-notification-settings.component';

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
        (notification) => {
          this.notification = {
            id: notification.id,
            title: notification.title,
            trigger: notification.trigger,
            time: notification.time,
            schedule: notification.schedule?.cron ?? '',
            platforms: Object.entries(notification.platforms).map(([name, details]) => ({ name, ...details })),
            status: notification.status
          };
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

  onEditNotificationInfo(platform: string): void {}

  onEditNotificationSettings(): void {
    this.dialog
      .open(UbsAdminNotificationSettingsComponent, {
        // panelClass: 'edit-notification-popup',
        hasBackdrop: true,
        data: {
          title: { en: this.notification.title.en, ua: this.notification.title.ua },
          trigger: this.notification.trigger,
          schedule: this.notification.schedule,
          status: this.notification.status
        }
      })
      .afterClosed()
      .subscribe((settings) => {
        console.log(settings);
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
