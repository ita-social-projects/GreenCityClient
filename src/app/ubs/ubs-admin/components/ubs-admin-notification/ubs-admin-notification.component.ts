import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take } from 'rxjs/operators';
import { NotificationsService, notificationTriggers, notificationStatuses } from '../../services/notifications.service';
import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form/ubs-admin-notification-edit-form.component';
import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings/ubs-admin-notification-settings.component';

@Component({
  selector: 'app-ubs-admin-notification',
  templateUrl: './ubs-admin-notification.component.html',
  styleUrls: ['./ubs-admin-notification.component.scss']
})
export class UbsAdminNotificationComponent implements OnInit {
  icons = {
    edit: 'assets/img/ubs-admin-notifications/pencil.svg',
    delete: './assets/img/ubs-admin-notifications/trashcan.svg',
    activate: './assets/img/ubs-admin-notifications/counterclockwise.svg'
  };

  form: FormGroup;
  triggers = notificationTriggers;
  statuses = notificationStatuses;
  lang = 'en';
  notification = null;

  platforms = ['email', 'telegram', 'viber'];

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.lang = lang;
    });
    this.route.params.subscribe((params) => {
      const id = Number(params.id);
      this.loadNotification(id);
    });
  }

  // schema = {
  //   id: 1,
  //   title: {
  //     en: '',
  //     ua: ''
  //   },
  //   trigger: '',
  //   time: '',
  //   schedule: { cron: '' },
  //   status: '',

  //   platforms: {
  //     email: {
  //       status: 'ACTIVE',
  //       body: {
  //         en: '',
  //         ua: ''
  //       }
  //     },
  //     telegram: { status: 'ACTIVE', body: { en: '', ua: '' } },
  //     viber: { status: 'ACTIVE', body: { en: '', ua: '' } }
  //   }
  // };

  loadNotification(id) {
    this.notificationsService
      .getNotificationTemplate(id)
      .pipe(take(1))
      .subscribe((notification) => {
        this.notification = {
          id: notification.id,
          title: {
            en: notification.title.en,
            ua: notification.title.ua
          },
          trigger: notification.trigger,
          time: notification.time,
          schedule: notification.schedule?.cron ?? '',
          text: {
            email: {
              en: notification.body.en,
              ua: notification.body.ua
            },
            telegram: {
              en: notification.body.en,
              ua: notification.body.ua
            },
            viber: {
              en: notification.body.en,
              ua: notification.body.ua
            }
          },
          platformStatus: {
            email: 'ACTIVE',
            telegram: 'ACTIVE',
            viber: 'INACTIVE'
          },
          status: notification.status
        };
      });
  }

  onEditNotificationInfo(platform: string): void {
    const dialogRef = this.dialog.open(UbsAdminNotificationEditFormComponent, {
      panelClass: 'edit-notification-popup',
      hasBackdrop: true,
      data: { platform, text: this.notification.text[platform] }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (!updated) {
        return;
      }
      this.notification.title[platform] = updated.title;
      this.notification.text[platform] = updated.text;
    });
  }

  onEditNotificationSettings() {
    this.dialog.open(UbsAdminNotificationSettingsComponent, {
      panelClass: 'edit-notification-popup',
      hasBackdrop: true,
      data: {
        title: { en: this.notification.title.en, ua: this.notification.title.ua },
        trigger: this.notification.trigger,
        schedule: this.notification.schedule,
        status: this.notification.status
      }
    });
  }

  onActivatePlatform(platform: string) {
    this.notification.platformStatus[platform] = 'ACTIVE';
  }

  onDeactivatePlatform(platform: string) {
    this.notification.platformStatus[platform] = 'INACTIVE';
  }

  onCancel() {
    this.router.navigate(['../../notifications'], { relativeTo: this.route });
  }

  onSaveChanges() {}
}
