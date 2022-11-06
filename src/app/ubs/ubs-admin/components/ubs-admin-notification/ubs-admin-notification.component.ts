import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take } from 'rxjs/operators';
import { NotificationsService, notificationTriggers, notificationStatuses } from '../../services/notifications.service';
import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form/ubs-admin-notification-edit-form.component';

@Component({
  selector: 'app-ubs-admin-notification',
  templateUrl: './ubs-admin-notification.component.html',
  styleUrls: ['./ubs-admin-notification.component.scss']
})
export class UbsAdminNotificationComponent implements OnInit {
  public icons = {
    setting: './assets/img/ubs-tariff/setting.svg',
    crumbs: './assets/img/ubs-tariff/crumbs.svg',
    restore: './assets/img/ubs-tariff/restore.svg',
    arrowDown: './assets/img/ubs-tariff/arrow-down.svg',
    arrowRight: './assets/img/ubs-tariff/arrow-right.svg'
  };

  form: FormGroup;
  triggers = notificationTriggers;
  statuses = notificationStatuses;
  lang = 'en';
  notification = null;

  recevProps = {
    begin: new Date('05/11/2022'),
    end: new Date('09/11/2022'),
    period: 'monthly',
    subperiod: 'on-week-on-day',
    interval: 3,
    week: 'second',
    weekday: 'wed'
  };
  isSettingsEditable = false;

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.lang = lang;
    });

    this.form = this.fb.group({
      topic: ['', Validators.required],
      text: ['', Validators.required],
      trigger: [''],
      period: [''],
      status: ['']
    });
    this.form.valueChanges.subscribe((changes) => {
      console.log(changes);
    });

    this.route.params.subscribe((params) => {
      const id = Number(params.id);
      this.loadNotification(id);
    });
  }

  async loadNotification(id) {
    this.notificationsService
      .getNotificationTemplate(id)
      .pipe(take(1))
      .subscribe((notification) => {
        this.notification = {
          id: notification.id,
          topic: {
            en: notification.title.en,
            ua: notification.title.ua
          },
          trigger: notification.trigger,
          time: notification.time,
          period: notification.schedule?.cron ?? '',
          text: {
            en: notification.body.en,
            ua: notification.body.ua
          },
          status: notification.status
        };
      });

    this.form.setValue({
      topic: this.notification.topic.en,
      text: this.notification.text.en,
      trigger: this.notification.trigger,
      period: this.notification.period,
      status: this.notification.status
    });
  }

  // isInfoEditable = false;

  onEditNotificationInfo() {
    // this.isInfoEditable = !this.isInfoEditable;
    const dialogRef = this.dialog.open(UbsAdminNotificationEditFormComponent, {
      panelClass: 'edit-notification-popup',
      hasBackdrop: true,
      data: { topic: this.notification.topic, text: this.notification.text }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (!updated) {
        return;
      }
      this.notification.topic = updated.topic;
      this.notification.text = updated.text;
    });
  }

  onEditNotificationSettings() {
    this.isSettingsEditable = !this.isSettingsEditable;
  }

  // onStatusChange(event: any) {
  //   this.form.get('status').setValue(event.target.value);
  // }
}
