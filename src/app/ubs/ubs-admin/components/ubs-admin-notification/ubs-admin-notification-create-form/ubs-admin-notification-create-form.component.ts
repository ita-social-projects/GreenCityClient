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
  receiverTypes = ['EMAIL', 'SITE', 'MOBILE'];

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
      // dynamic body fields per receiver type
      bodyUk_EMAIL: ['', Validators.required],
      bodyEn_EMAIL: ['', Validators.required],
      bodyUk_SITE: ['', Validators.required],
      bodyEn_SITE: ['', Validators.required],
      bodyUk_MOBILE: ['', Validators.required],
      bodyEn_MOBILE: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const payload = {
        titleEn: this.form.value.titleEn,
        titleUk: this.form.value.titleUk,
        schedule: this.form.value.schedule,
        userCategory: this.form.value.userCategory,
        platforms: this.receiverTypes.map((type) => ({
          notificationReceiverType: type,
          bodyUk: this.form.value[`bodyUk_${type}`],
          bodyEn: this.form.value[`bodyEn_${type}`]
        }))
      };

      this.notificationsService.createNotification(payload).subscribe(() => {
        this.router.navigate(['/ubs-admin/notifications']);
      });
    }
  }

  private capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
