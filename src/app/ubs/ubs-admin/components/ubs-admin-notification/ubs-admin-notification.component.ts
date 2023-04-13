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
import { notificationTriggerTimeMock, notificationTriggersMock } from '../../services/notifications.service';

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
  notification = null;
  notificationTriggerTime = notificationTriggerTimeMock;
  notificationTriggers = notificationTriggersMock;
  notificationId: number;

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
      this.notificationId = Number(params.id);
      this.loadNotification(this.notificationId);
    });
  }

  loadNotification(id: number): void {
    this.notificationsService
      .getNotificationTemplate(id)
      .pipe(take(1))
      .subscribe(
        (notification: NotificationTemplate) => {
          this.notification = notification;
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
    const platformToUpdate = this.notification.platforms.find((pf) => pf.nameEng === platform);

    this.dialog
      .open(UbsAdminNotificationEditFormComponent, {
        hasBackdrop: true,
        data: {
          platform,
          text: {
            ua: platformToUpdate.body,
            en: platformToUpdate.bodyEng
          }
        }
      })
      .afterClosed()
      .subscribe((updates: { text: { ua: string; en: string } }) => {
        if (!updates) {
          return;
        }
        platformToUpdate.body = updates.text.ua;
        platformToUpdate.bodyEng = updates.text.en;
      });
  }

  onEditNotificationSettings(): void {
    this.dialog
      .open(UbsAdminNotificationSettingsComponent, {
        hasBackdrop: true,
        data: {
          title: {
            en: this.notification.notificationTemplateMainInfoDto.titleEng,
            ua: this.notification.notificationTemplateMainInfoDto.title
          },
          trigger: this.notification.notificationTemplateMainInfoDto.trigger,
          time: this.notification.notificationTemplateMainInfoDto.time,
          schedule: this.notification.notificationTemplateMainInfoDto.schedule
        }
      })
      .afterClosed()
      .subscribe((updates: { title: { en: string; ua: string }; trigger: string; time: string; schedule: string }) => {
        if (!updates) {
          return;
        }
        this.findNewDescription(updates);
        this.notification.notificationTemplateMainInfoDto.title = updates.title.ua;
        this.notification.notificationTemplateMainInfoDto.titleEng = updates.title.en;
        this.notification.notificationTemplateMainInfoDto.trigger = updates.trigger;
        this.notification.notificationTemplateMainInfoDto.time = updates.time;
        this.notification.notificationTemplateMainInfoDto.schedule = updates.schedule;
      });
  }

  private findNewDescription(updatedNotification) {
    const indexTrigger = this.notificationTriggers.findIndex((item) => item.trigger === updatedNotification.trigger);
    const indexTime = this.notificationTriggerTime.findIndex((item) => item.time === updatedNotification.time);

    this.notification.notificationTemplateMainInfoDto.triggerDescription = this.notificationTriggers[indexTrigger].triggerDescription;
    this.notification.notificationTemplateMainInfoDto.triggerDescriptionEng = this.notificationTriggers[indexTrigger].triggerDescriptionEng;

    this.notification.notificationTemplateMainInfoDto.timeDescription = this.notificationTriggerTime[indexTime].timeDescription;
    this.notification.notificationTemplateMainInfoDto.timeDescriptionEng = this.notificationTriggerTime[indexTime].timeDescriptionEng;
  }

  onActivatePlatform(platform: string): void {
    this.notification.platforms.find((pf) => pf.nameEng === platform).status = 'ACTIVE';
  }

  onDeactivatePlatform(platform: string): void {
    this.notification.platforms.find((pf) => pf.nameEng === platform).status = 'INACTIVE';
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

        this.notificationsService.deactivateNotificationTemplate(this.notificationId).pipe(takeUntil(this.destroy)).subscribe();
        this.navigateToNotificationList();
      });
  }

  onCancel(): void {
    this.navigateToNotificationList();
  }

  onSaveChanges(): void {
    this.notificationsService.updateNotificationTemplate(this.notificationId, this.notification).pipe(takeUntil(this.destroy)).subscribe();
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
