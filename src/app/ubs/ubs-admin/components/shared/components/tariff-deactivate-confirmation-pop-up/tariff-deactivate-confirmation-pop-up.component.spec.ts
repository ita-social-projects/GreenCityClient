import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TariffDeactivateConfirmationPopUpComponent } from './tariff-deactivate-confirmation-pop-up.component';
import { ModalTextComponent } from '../modal-text/modal-text.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { DialogTariffComponent } from 'src/app/ubs/ubs-admin/components/shared/components/dialog-tariff/dialog-tariff.component';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';

describe('TariffDeactivateConfirmationPopUpComponent', () => {
  let component: TariffDeactivateConfirmationPopUpComponent;
  let fixture: ComponentFixture<TariffDeactivateConfirmationPopUpComponent>;

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });
  const fakeMatDialog = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialog.afterClosed.and.returnValue(of(true));
  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage', 'getLangValue', 'getCurrentLangObs']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');
  languageServiceMock.getLangValue.and.returnValue('val1');
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TariffDeactivateConfirmationPopUpComponent, DialogTariffComponent, LangValueDirective],
      imports: [MatDialogModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialog },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: MatSnackBarComponent, useValue: { openSnackBar: () => {} } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffDeactivateConfirmationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    matDialogMock.open.and.returnValue(fakeMatDialog as any);
    component.onCancelClick();
    expect(fakeMatDialog.close).toHaveBeenCalled();
    expect(matDialogMock.open).toHaveBeenCalledWith(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        name: 'cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
  });
});
