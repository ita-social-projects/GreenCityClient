import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { NotificationsService } from '../../services/notifications.service';
import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings/ubs-admin-notification-settings.component';
import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form/ubs-admin-notification-edit-form.component';
import { NotificationTemplate } from '../../models/notifications.model';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LanguageService } from 'src/app/main/i18n/language.service';

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
  currentLanguage: string;
  initialNotification = null;
  notification = null;

  constructor(
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.currentLanguage = lang;
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
          this.initialNotification = notification;
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
      .subscribe((updates: { text: { ua: string; en: string } }) => {
        if (!updates) {
          return;
        }
        this.notification.platforms.find((pf) => pf.name === platform).body = updates.text;
      });
  }

  onEditNotificationSettings(): void {
    this.dialog
      .open(UbsAdminNotificationSettingsComponent, {
        hasBackdrop: true,
        data: {
          title: { en: this.notification.title.en, ua: this.notification.title.ua },
          trigger: this.notification.trigger,
          time: this.notification.time,
          schedule: this.notification.schedule
        }
      })
      .afterClosed()
      .subscribe((updates: { title: { en: string; ua: string }; trigger: string; time: string; schedule: string }) => {
        if (!updates) {
          return;
        }
        this.notification.title = updates.title;
        this.notification.trigger = updates.trigger;
        this.notification.schedule = updates.schedule;
        this.notification.time = updates.time;
      });
  }

  onActivatePlatform(platform: string): void {
    this.notification.platforms.find((pf) => pf.name === platform).status = 'ACTIVE';
  }

  onDeactivatePlatform(platform: string): void {
    this.notification.platforms.find((pf) => pf.name === platform).status = 'INACTIVE';
  }

  onDeactivateNotification() {
    const translationKeys = {
      title: 'ubs-notifications.deactivation-popup.title',
      text: 'ubs-notifications.deactivation-popup.text',
      confirm: 'ubs-notifications.deactivation-popup.buttons.confirm',
      cancel: 'ubs-notifications.deactivation-popup.buttons.cancel'
    };
    this.dialog
      .open(ConfirmationDialogComponent, { hasBackdrop: true, data: translationKeys })
      .afterClosed()
      .subscribe((deactivate) => {
        if (!deactivate) {
          return;
        }
        this.notificationsService.deactivateNotificationTemplate(this.notification.id);
        this.navigateToNotificationList();
      });
  }

  onCancel(): void {
    this.navigateToNotificationList();
  }

  onSaveChanges(): void {
    this.notificationsService.updateNotificationTemplate(this.notification.id, this.notification);
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }
}
