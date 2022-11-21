import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take } from 'rxjs/operators';
import { NotificationsService, notificationTriggers, notificationStatuses } from '../../services/notifications.service';

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

  loadNotification(id) {
    this.notificationsService
      .getNotificationTemplate(id)
      .pipe(take(1))
      .subscribe((notification) => {
        this.notification = {
          id: notification.id,
          title: notification.title,
          trigger: notification.trigger,
          time: notification.time,
          schedule: notification.schedule?.cron ?? '',
          platforms: Object.entries(notification.platforms).map(([name, details]) => ({ name, ...details })),
          status: notification.status
        };
      });
  }

  onEditNotificationInfo(platform: string): void {}

  onEditNotificationSettings() {}

  onActivatePlatform(platform: string) {
    this.notification.platforms.find((pf) => pf.name === platform).status = 'ACTIVE';
  }

  onDeactivatePlatform(platform: string) {
    this.notification.platforms.find((pf) => pf.name === platform).status = 'INACTIVE';
  }

  onCancel() {
    this.router.navigate(['../../notifications'], { relativeTo: this.route });
  }

  onSaveChanges() {}
}
