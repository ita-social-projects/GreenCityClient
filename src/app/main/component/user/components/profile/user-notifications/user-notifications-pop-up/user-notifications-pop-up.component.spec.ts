import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserNotificationsPopUpComponent } from './user-notifications-pop-up.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { NotificationsService } from 'src/app/ubs/ubs-admin/services/notifications.service';
import { UserNotificationService } from '@global-user/services/user-notification.service';

describe('UserNotificationsPopUpComponent', () => {
  let component: UserNotificationsPopUpComponent;
  let fixture: ComponentFixture<UserNotificationsPopUpComponent>;

  const dialogRefStub = jasmine.createSpyObj('MatDialogRef', ['close', 'keydownEvents']);
  dialogRefStub.close = () => {};
  dialogRefStub.keydownEvents = () => of(1);

  let notificationServiceMock: UserNotificationService;
  notificationServiceMock = jasmine.createSpyObj('UserNotificationService', ['getThreeNewNotification']);
  notificationServiceMock.getThreeNewNotification = () => of();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationsPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatSnackBarComponent, useValue: {} },
        { provide: NotificationsService, useValue: notificationServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should call get three New Notifications when onInit is invoken', () => {
    const notifications = [];
    const spy = spyOn((component as any).userNotificationService, 'getThreeNewNotification').and.returnValue(of(notifications));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.notifications).toEqual(notifications);
  });

  it('should call close after openAll notifications', () => {
    const spy = spyOn((component as any).dialogRef, 'close');
    component.openAll();
    expect(spy).toHaveBeenCalledWith({ openAll: true });
  });

  it('should cancel streams after ngOnDestroy', () => {
    const destroy$ = 'onDestroy$';
    const nextSpy = spyOn(component[destroy$], 'next');
    const completeSpy = spyOn(component[destroy$], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
