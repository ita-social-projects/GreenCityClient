import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

import {
  NotificationsService,
  notificationTriggers,
  notificationTriggerTime,
  notificationStatuses
} from '../../../services/notifications.service';

@Component({
  selector: 'app-ubs-admin-notification-settings',
  templateUrl: './ubs-admin-notification-settings.component.html',
  styleUrls: ['./ubs-admin-notification-settings.component.scss']
})
export class UbsAdminNotificationSettingsComponent implements OnInit {
  form: FormGroup;

  triggers = notificationTriggers;
  lang = 'en';

  schedule = null;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { title: { en: string; ua: string }; trigger: string; schedule: string; status: string },
    public dialogRef: MatDialogRef<UbsAdminNotificationSettingsComponent>,
    private localStorageService: LocalStorageService
  ) {
    console.log(this.data);
    this.form = this.fb.group({
      titleUa: [this.data.title.en],
      titleEn: [this.data.title.ua],
      trigger: [this.data.trigger]
      // status: [this.data.status]
    });
    this.schedule = this.data.schedule;
  }

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.lang = lang;
    });
  }

  onScheduleSelected(cron) {
    this.schedule = cron;
  }

  onSubmit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
