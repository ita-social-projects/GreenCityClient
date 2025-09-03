import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatSnackBarService } from './mat-snack-bar.service';
import { SnackbarClassName } from './error-constants';

describe('MatSnackBarService', () => {
  let service: MatSnackBarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        MatSnackBarService,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: TranslateService, useValue: translateSpy }
      ]
    });

    service = TestBed.inject(MatSnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a snack bar with translated message for a given type', () => {
    const type = 'success';
    const translatedMessage = 'Operation successful';
    translateSpy.get.and.returnValue(of(translatedMessage));

    service.openSnackBar(type);

    expect(translateSpy.get).toHaveBeenCalledWith('snack-bar.success.default', {});
    expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, ' ', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [SnackbarClassName.success, undefined]
    });
  });

  it('should include additional value in translation parameters', () => {
    const type = 'successConfirmPassword';
    const additionalValue = '12345';
    const translatedMessage = 'Password confirmed for order 12345';
    translateSpy.get.and.returnValue(of(translatedMessage));

    service.openSnackBar(type, additionalValue);

    expect(translateSpy.get).toHaveBeenCalledWith('snack-bar.success.confirm-restore-password', { orderId: '12345' });
    expect(snackBarSpy.open).toHaveBeenCalledWith(translatedMessage, ' ', jasmine.any(Object));
  });
});
