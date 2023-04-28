import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { Service } from '../../../../models/tariffs.interface';
import { TariffsService } from '../../../../services/tariffs.service';
import { Patterns } from 'src/assets/patterns/patterns';

describe('UbsAdminTariffsAddServicePopupComponent', () => {
  let component: UbsAdminTariffsAddServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddServicePopUpComponent>;
  let httpMock: HttpTestingController;
  let fakeTariffService: TariffsService;

  const button = {
    add: 'add',
    update: 'update'
  };

  const fakeBagForm = new FormGroup({
    name: new FormControl('fake'),
    nameEng: new FormControl('fake'),
    price: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice)]),
    description: new FormControl('fake'),
    descriptionEng: new FormControl('fake')
  });

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

  it('should return price Control on getControl', () => {
    (component as any).initForm();
    const price = component.getControl('price');
    expect(price).toEqual(component.addServiceForm.get('price'));
  });

  it('should fillFields correctly', () => {
    component.addServiceForm.patchValue(fakeBagForm.value);
    expect(component.addServiceForm.value).toEqual(fakeBagForm.value);
  });

  it('should call addNewService correctly', () => {
    const addNewServiceSpy = spyOn(component, 'addNewService');
    component.addNewService();
    fakeTariffService.createService(fakeService, 1);
    expect(addNewServiceSpy).toHaveBeenCalled();
  });

  it('should call editService correctly', () => {
    const id = 1;
    const service = {
      name: 'Назва сервісу',
      nameEng: 'Service name',
      price: 200,
      description: 'Опис сервісу',
      descriptionEng: 'Service discr'
    };
    const editServiceSpy = spyOn(component, 'editService');
    component.editService();
    fakeTariffService.editService(service, id);
    expect(editServiceSpy).toHaveBeenCalled();
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
