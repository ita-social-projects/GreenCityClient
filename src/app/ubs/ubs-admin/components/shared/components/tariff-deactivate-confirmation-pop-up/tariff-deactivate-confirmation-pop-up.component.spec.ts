import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TariffDeactivateConfirmationPopUpComponent } from './tariff-deactivate-confirmation-pop-up.component';
import { ModalTextComponent } from '../modal-text/modal-text.component';
import { TariffsService } from '../../../../services/tariffs.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TariffDeactivateConfirmationPopUpComponent', () => {
  let component: TariffDeactivateConfirmationPopUpComponent;
  let fixture: ComponentFixture<TariffDeactivateConfirmationPopUpComponent>;

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });
  const fakeMatDialog = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialog.afterClosed.and.returnValue(of(true));
  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TariffDeactivateConfirmationPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialog },
        { provide: LanguageService, useValue: languageServiceMock }
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

  it(`setDate should be called in ngOnInit`, () => {
    const setDateSpy = spyOn(component as any, 'setDate');
    component.ngOnInit();
    expect(setDateSpy).toHaveBeenCalled();
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
