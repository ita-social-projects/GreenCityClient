import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { NotificationsService } from 'src/app/ubs/ubs-admin/services/notifications.service';

@Component({
  selector: 'app-ubs-admin-notification-create-form',
  templateUrl: './ubs-admin-notification-create-form.component.html',
  styleUrls: ['./ubs-admin-notification-create-form.component.scss']
})
export class UbsAdminNotificationCreateFormComponent implements OnInit {
  form: FormGroup;
  userCategories = ['USERS_WITH_ORDERS_MADE_LESS_THAN_3_MONTHS'];
  receiverTypes = ['EMAIL'];

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titleEn: ['', Validators.required],
      titleUk: ['', Validators.required],
      schedule: ['', Validators.required],
      userCategory: [this.userCategories[0], Validators.required],
      bodyEn: ['', Validators.required],
      bodyUk: ['', Validators.required],
      notificationReceiverType: [this.receiverTypes[0], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const payload = {
        notificationTemplateUpdateInfo: {
          titleEn: this.form.value.titleEn,
          titleUk: this.form.value.titleUk,
          schedule: this.form.value.schedule,
          trigger: 'SOME_TRIGGER',
          type: 'SOME_TYPE',
          time: 'SOME_TIME'
        },
        platforms: [
          {
            name: '',
            nameEn: '',
            status: 'ACTIVE',
            bodyEn: this.form.value.bodyEn,
            bodyUk: this.form.value.bodyUk,
            receiverType: this.form.value.notificationReceiverType
          }
        ]
      };

      this.notificationsService.createNotification(payload).subscribe(() => {
        this.router.navigate(['/ubs-admin/notifications']);
      });
    }
  }
}
