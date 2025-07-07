import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  currentLanguage: string;

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.form = this.fb.group({
      titleEn: [''],
      titleUk: [''],
      triggerDescriptionEn: [''],
      triggerDescriptionUk: [''],
      timeDescriptionEn: [''],
      timeDescriptionUk: [''],
      schedule: [''],
      status: ['INACTIVE'] // or default
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.notificationsService.createNotification(this.form.value).subscribe(() => {
        this.router.navigate(['/ubs-admin/notifications']);
      });
    }
  }
}
