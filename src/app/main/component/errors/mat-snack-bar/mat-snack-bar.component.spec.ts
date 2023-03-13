import { MatSnackBarModule } from '@angular/material/snack-bar';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from './mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MatSnackBarComponent', () => {
  let component: MatSnackBarComponent;
  let fixture: ComponentFixture<MatSnackBarComponent>;
  let matSnackBarMock: MatSnackBar;
  matSnackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

  beforeEach(async(() => {
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
      const spy = spyOn(component.snackType, 'successConfirmPassword').and.callThrough();
      component.snackType[`successConfirmPassword`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the function to get type of snackBar', () => {
      const spy = spyOn(component.snackType, 'signUp').and.callThrough();
      component.snackType[`signUp`]();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the successConfirmEmail to close the dialog', () => {
      const spy = spyOn(component.snackType, 'successConfirmEmail').and.callThrough();
      component.snackType[`successConfirmEmail`]();
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
  });
});
