import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { Service } from '../../../../models/tariffs.interface';
import { TariffsService } from '../../../../services/tariffs.service';

describe('UbsAdminTariffsAddServicePopupComponent', () => {
  let component: UbsAdminTariffsAddServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddServicePopUpComponent>;
  let httpMock: HttpTestingController;
  let fakeTariffService: TariffsService;

  const button = {
    add: 'add',
    update: 'update'
  };

  const fakeService: Service = {
    price: 1,
    description: 'Ua',
    descriptionEng: 'Eng',
    name: 'Name',
    nameEng: 'NameEng',
    tariffId: 1
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddServicePopUpComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, ReactiveFormsModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: button }, FormBuilder, { provide: MatDialogRef, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsAddServicePopUpComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fakeTariffService = TestBed.inject(TariffsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should be called', () => {
    const spyOnInit = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spyOnInit).toHaveBeenCalled();
  });

  it(`initForm should be called in ngOnInit`, () => {
    const initFormSpy = spyOn(component as any, 'initForm');
    component.ngOnInit();
    expect(initFormSpy).toHaveBeenCalled();
  });

  it(`fillFields should be called in ngOnInit`, () => {
    const fillFieldsSpy = spyOn(component as any, 'fillFields');
    component.ngOnInit();
    expect(fillFieldsSpy).toHaveBeenCalled();
  });

  it(`editForm should be called in initForm`, () => {
    component.receivedData.serviceData = fakeService;
    const editFormSpy = spyOn(component as any, 'editForm');
    (component as any).initForm();
    expect(editFormSpy).toHaveBeenCalled();
  });

  it(`addForm should be called in initForm`, () => {
    component.receivedData.serviceData = !fakeService;
    const addFormSpy = spyOn(component as any, 'addForm');
    (component as any).initForm();
    expect(addFormSpy).toHaveBeenCalled();
  });

  it('should create service', () => {
    expect(fakeTariffService).toBeTruthy();
  });

  it('should call addNewService correctly', () => {
    const addNewServiceSpy = spyOn(component, 'addNewService');
    component.addNewService();
    fakeTariffService.createService(fakeService, 1);
    expect(addNewServiceSpy).toHaveBeenCalled();
  });

  it('should cancel streams after ngOnDestroy', () => {
    const nextSpy = spyOn((component as any).destroy, 'next');
    const completeSpy = spyOn((component as any).destroy, 'unsubscribe');
    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  it('Check whether method onCancel called with proper args', () => {
    matDialogMock.open = jasmine.createSpy().withArgs(ModalTextComponent, {
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
