import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from './mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MatSnackBarComponent', () => {
  let component: MatSnackBarComponent;
  let fixture: ComponentFixture<MatSnackBarComponent>;
  let matSnackBarMock: MatSnackBar;
  matSnackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatSnackBarComponent],
      imports: [MatSnackBarModule, TranslateModule.forRoot(), BrowserAnimationsModule],
      providers: [{ provide: MatSnackBar, useValue: matSnackBarMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Basic tests', () => {
    it('should create matSnackComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should call openSnackBar()', () => {
      const spy = spyOn(component, 'openSnackBar').and.callThrough();
      component.openSnackBar('error');
      expect(spy).toHaveBeenCalled();
    });

    it('should call getSnackBarMessage()', () => {
      const spy = spyOn(component, 'getSnackBarMessage').and.callThrough();
      component.getSnackBarMessage('snack-bar.error.default');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('test different notification types call', () => {
    it('should call the function to close the dialog', () => {
      const spy = spyOn(component.snackType, 'error').and.callThrough();
      component.snackType[`error`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'attention').and.callThrough();
      component.snackType[`attention`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'success').and.callThrough();
      component.snackType[`success`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'exitConfirmRestorePassword').and.callThrough();
      component.snackType[`exitConfirmRestorePassword`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successRestorePassword').and.callThrough();
      component.snackType[`successRestorePassword`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'CartValidation').and.callThrough();
      component.snackType[`CartValidation`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'lessPoints').and.callThrough();
      component.snackType[`lessPoints`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'existAddress').and.callThrough();
      component.snackType[`existAddress`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successConfirmEmail').and.callThrough();
      component.snackType[`successConfirmEmail`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successConfirmPassword').and.callThrough();
      component.snackType[`successConfirmPassword`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'signUp').and.callThrough();
      component.snackType[`signUp`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the errorMessage to close the dialog', () => {
      const spy = spyOn(component.snackType, 'errorMessage').and.callThrough();
      component.snackType[`errorMessage`]('Ups');
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'cafeNotificationsExists').and.callThrough();
      component.snackType[`cafeNotificationsExists`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'cafeNotificationsCloseTime').and.callThrough();
      component.snackType[`cafeNotificationsCloseTime`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'cafeNotificationsBreakTime').and.callThrough();
      component.snackType[`cafeNotificationsBreakTime`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'cafeNotificationsPhotoUpload').and.callThrough();
      component.snackType[`cafeNotificationsPhotoUpload`]();

      expect(spy).toHaveBeenCalled();
    });

    it('should call the function habitDeleted to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'habitDeleted').and.callThrough();
      component.snackType[`habitDeleted`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function habitAdded to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'habitAdded').and.callThrough();
      component.snackType[`habitAdded`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function habitUpdated to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'habitUpdated').and.callThrough();
      component.snackType[`habitUpdated`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function habitDidNotGiveUp to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'habitDidNotGiveUp').and.callThrough();
      component.snackType[`habitDidNotGiveUp`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function successRestorePassword to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successRestorePassword').and.callThrough();
      component.snackType[`successRestorePassword`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function successConfirmPassword to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successConfirmPassword').and.callThrough();
      component.snackType[`successConfirmPassword`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function signUp to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'signUp').and.callThrough();
      component.snackType[`signUp`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function successConfirmEmail to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successConfirmEmail').and.callThrough();
      component.snackType[`successConfirmEmail`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function successConfirmSaveOrder to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successConfirmSaveOrder').and.callThrough();
      component.snackType[`successConfirmSaveOrder`]('');
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function successConfirmUpdateOrder to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'successConfirmUpdateOrder').and.callThrough();
      component.snackType[`successConfirmUpdateOrder`]('');
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function addedAddress to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'addedAddress').and.callThrough();
      component.snackType[`addedAddress`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function existAddress to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'existAddress').and.callThrough();
      component.snackType[`existAddress`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function CartValidation to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'CartValidation').and.callThrough();
      component.snackType[`CartValidation`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function addedEvent to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'addedEvent').and.callThrough();
      component.snackType[`addedEvent`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function  savedChangesToUserProfile to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'savedChangesToUserProfile').and.callThrough();
      component.snackType[`savedChangesToUserProfile`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function  updatedNotification to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'updatedNotification').and.callThrough();
      component.snackType[`updatedNotification`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function  joinedEvent to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'joinedEvent').and.callThrough();
      component.snackType[`joinedEvent`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function  errorJoinEvent to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'errorJoinEvent').and.callThrough();
      component.snackType[`errorJoinEvent`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function  tooLongInput to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'tooLongInput').and.callThrough();
      component.snackType[`tooLongInput`]();
      expect(spy).toHaveBeenCalled();
    });
  });
});
