import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ModalTextComponent } from './modal-text.component';
import { TariffsService } from '../../../../services/tariffs.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModalTextComponent', () => {
  let component: ModalTextComponent;
  let fixture: ComponentFixture<ModalTextComponent>;
  let fakeTariffService: TariffsService;
  const fakeTitles = {
    title: 'popupTitle',
    text: 'fakeText1',
    text2: 'fakeText2',
    action: 'fake'
  };

  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  const FAKE_SERVICE_ID = 12345;
  const FAKE_DATE = 'Трав. 05, 2023';
  const tariffsServiceMock = {
    deleteTariffForService: () => {
      return {
        pipe: () => of('fakeResult')
      };
    },
    getServiceId: () => FAKE_SERVICE_ID,
    deleteService: () => {
      return {
        pipe: () => of('fakeRes')
      };
    },
    setDate: () => FAKE_DATE
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTextComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: fakeTitles },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fakeTariffService = TestBed.inject(TariffsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close on cancel matDialogRef', () => {
    component.onNoClick();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it(`setDate should be called in ngOnInit`, () => {
    const setDateSpy = spyOn(component as any, 'setDate');
    component.ngOnInit();
    expect(setDateSpy).toHaveBeenCalled();
  });

  it('should set date', () => {
    component.setDate();
    expect(component.newDate).toEqual(fakeTariffService.setDate('ua'));
  });

  it('should close all matDialogRef', () => {
    component.onYesClick(true);
    expect(matDialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should set titles after setTitles method', () => {
    component.ngOnInit();
    expect(component.title).toBe(fakeTitles.title);
    expect(component.text).toBe(fakeTitles.text);
    expect(component.text2).toBe(fakeTitles.text2);
    expect(component.action).toBe(fakeTitles.action);
  });

  it('should return true if value is cancel', () => {
    const result = component.check('cancel');
    expect(result).toEqual(true);
  });

  it('should return false if value is not cancel', () => {
    const result = component.check('nocancel');
    expect(result).toEqual(false);
  });

  it('should close matDialogRef after result', () => {
    component.deleteTariffForService();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should close matDialogRef after result', () => {
    component.deleteService();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
});
