import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ModalTextComponent } from './modal-text.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TariffsService } from '../../../../services/tariffs.service';

describe('ModalTextComponent', () => {
  let component: ModalTextComponent;
  let fixture: ComponentFixture<ModalTextComponent>;
  const fakeTitles = {
    title: 'popupTitle',
    text: 'fakeText1',
    text2: 'fakeText2',
    action: 'fake'
  };
  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });
  const FAKE_SERVICE_ID = 12345;
  const tariffsForServiceStub = {
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
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTextComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: fakeTitles },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsForServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close on cancel matDialogRef', () => {
    component.onNoClick();
    expect(matDialogRefMock.close).toHaveBeenCalled();
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
