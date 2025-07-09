import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminNotificationCreateFormComponent } from './ubs-admin-notification-create-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsService } from '@ubs/ubs-admin/services/notifications.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('UbsAdminNotificationCreateFormComponent', () => {
  let component: UbsAdminNotificationCreateFormComponent;
  let fixture: ComponentFixture<UbsAdminNotificationCreateFormComponent>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationsService>;
  let routerMock: jasmine.SpyObj<Router>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    notificationsServiceMock = jasmine.createSpyObj('NotificationsService', ['createNotification']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationCreateFormComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), MatSnackBarModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsAdminNotificationCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call createNotification and navigate on successful submit', () => {
    component.form.setValue({
      titleEn: 'Title EN',
      titleUk: 'Title UK',
      schedule: '* * * * *',
      userCategory: 'USERS_WITH_ORDERS_MADE_LESS_THAN_3_MONTHS',
      bodyUk_EMAIL: 'Body UK Email',
      bodyEn_EMAIL: 'Body EN Email',
      bodyUk_SITE: 'Body UK Site',
      bodyEn_SITE: 'Body EN Site',
      bodyUk_MOBILE: 'Body UK Mobile',
      bodyEn_MOBILE: 'Body EN Mobile'
    });

    notificationsServiceMock.createNotification.and.returnValue(of({}));
    component.onSubmit();
    expect(notificationsServiceMock.createNotification).toHaveBeenCalled();
  });

  it('should call createNotification and navigate on successful submit', () => {
    component.form.setValue({
      titleEn: 'Title EN',
      titleUk: 'Title UK',
      schedule: '* * * * *',
      userCategory: 'USERS_WITH_ORDERS_MADE_LESS_THAN_3_MONTHS',
      bodyUk_EMAIL: 'Body UK Email',
      bodyEn_EMAIL: 'Body EN Email',
      bodyUk_SITE: 'Body UK Site',
      bodyEn_SITE: 'Body EN Site',
      bodyUk_MOBILE: 'Body UK Mobile',
      bodyEn_MOBILE: 'Body EN Mobile'
    });

    notificationsServiceMock.createNotification.and.returnValue(of({}));
    component.onSubmit();
    expect(notificationsServiceMock.createNotification).toHaveBeenCalledWith(
      jasmine.objectContaining({
        titleEn: 'Title EN',
        platforms: jasmine.any(Array)
      })
    );
    expect(snackBarMock.open).toHaveBeenCalledWith('Notification successfully created!', 'Close', {
      duration: 3000,
      panelClass: ['snack-success']
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/ubs/admin/notifications']);
  });

  it('should not submit if form is invalid', () => {
    component.form.reset();
    component.onSubmit();
    expect(notificationsServiceMock.createNotification).not.toHaveBeenCalled();
    expect(snackBarMock.open).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
