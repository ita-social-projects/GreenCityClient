import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserNotificationsPopUpComponent } from './user-notifications-pop-up.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { NotificationsService } from 'src/app/ubs/ubs-admin/services/notifications.service';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('UserNotificationsPopUpComponent', () => {
  let component: UserNotificationsPopUpComponent;
  let fixture: ComponentFixture<UserNotificationsPopUpComponent>;

  const dialogRefStub = jasmine.createSpyObj('MatDialogRef', ['close', 'keydownEvents']);
  dialogRefStub.close = () => {};
  dialogRefStub.keydownEvents = () => of(1);

  const notificationServiceMock: UserNotificationService = jasmine.createSpyObj('UserNotificationService', ['getThreeNewNotification']);
  notificationServiceMock.getThreeNewNotification = () => of();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationsPopUpComponent, SpinnerComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientModule, MatDividerModule, MatProgressSpinnerModule],
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
