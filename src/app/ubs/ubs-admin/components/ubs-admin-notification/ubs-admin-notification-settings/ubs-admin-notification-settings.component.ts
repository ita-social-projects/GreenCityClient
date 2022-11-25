import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { notificationTriggers, notificationTriggerTime } from '../../../services/notifications.service';

@Component({
  selector: 'app-ubs-admin-notification-settings',
  templateUrl: './ubs-admin-notification-settings.component.html',
  styleUrls: ['./ubs-admin-notification-settings.component.scss']
})
export class UbsAdminNotificationSettingsComponent implements OnInit, OnDestroy {
  icons = {
    gear: './assets/img/ubs-admin-notifications/gear.svg',
    arrowDown: './assets/img/arrow-down.svg'
  };

  form: FormGroup;
  private destroy = new Subject<void>();

  triggers = notificationTriggers;
  times = notificationTriggerTime;
  lang = 'en';

  schedule: string | null = null;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: { en: string; ua: string }; trigger: string; time: string; schedule: string; status: string },
    public dialogRef: MatDialogRef<UbsAdminNotificationSettingsComponent>,
    private localStorageService: LocalStorageService
  ) {
    this.form = this.fb.group({
      titleUa: [data.title.ua],
      titleEn: [data.title.en],
      trigger: [data.trigger],
      time: [data.time]
    });
    this.schedule = data.schedule;
  }

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.lang = lang;
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onScheduleSelected(cron: string | null) {
    this.schedule = cron;
  }

  onSubmit(): void {
    const { titleEn, titleUa, trigger, time } = this.form.value;

    this.dialogRef.close({
      title: {
        en: titleEn,
        ua: titleUa
      },
      trigger,
      time,
      schedule: this.schedule
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
