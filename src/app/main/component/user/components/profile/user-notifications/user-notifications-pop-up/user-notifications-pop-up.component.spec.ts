import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserNotificationsPopUpComponent } from './user-notifications-pop-up.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('UserNotificationsPopUpComponent', () => {
  let component: UserNotificationsPopUpComponent;
  let fixture: ComponentFixture<UserNotificationsPopUpComponent>;
  const dialog = 'dialogRef';
  const dialogRefStub = {
    keydownEvents() {
      return of();
    },
    backdropClick() {
      return of();
    },
    close() {}
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationsPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: [] }
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

  it('should keydownEvents be called in ngOnInit', () => {
    const spy = spyOn(component[dialog], 'keydownEvents').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should backdropClick be called in ngOnInit', () => {
    const spy = spyOn(component[dialog], 'backdropClick').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call close on matDialogRef', () => {
    const spy = spyOn(component[dialog], 'close');
    component.closeDialog({ openAll: false });
    expect(spy).toHaveBeenCalledWith({ openAll: false });
  });

  it('should call close after openAll notifications', () => {
    const spy = spyOn(component[dialog], 'close');
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
