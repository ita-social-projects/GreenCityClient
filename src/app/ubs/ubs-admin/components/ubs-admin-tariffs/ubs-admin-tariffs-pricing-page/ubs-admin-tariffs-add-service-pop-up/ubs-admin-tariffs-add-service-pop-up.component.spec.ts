import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { Service } from '../../../../models/tariffs.interface';
import { TariffsService } from '../../../../services/tariffs.service';
import { Patterns } from 'src/assets/patterns/patterns';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LanguageService } from 'src/app/main/i18n/language.service';

describe('UbsAdminTariffsAddServicePopupComponent', () => {
  let component: UbsAdminTariffsAddServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddServicePopUpComponent>;
  let httpMock: HttpTestingController;
  let fakeTariffService: TariffsService;
  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  const button = {
    add: 'add',
    update: 'update'
  };

  const fakeBagForm = new FormGroup({
    name: new FormControl('fake', [Validators.required, Validators.pattern(Patterns.ServiceNamePattern), Validators.maxLength(255)]),
    nameEng: new FormControl('fake', [Validators.required, Validators.pattern(Patterns.ServiceNamePattern), Validators.maxLength(255)]),
    price: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice)]),
    description: new FormControl('fake', Validators.compose([Validators.required, Validators.maxLength(255)])),
    descriptionEng: new FormControl('fake', Validators.compose([Validators.required, Validators.maxLength(255)]))
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
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: button },
        FormBuilder,
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LanguageService, useValue: languageServiceMock }
      ],

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

  it(`setDate should be called in ngOnInit`, () => {
    const setDateSpy = spyOn(component as any, 'setDate');
    component.ngOnInit();
    expect(setDateSpy).toHaveBeenCalled();
  });

  it('component should initialize form with correct parameters', () => {
    component.addForm();
    expect(component.addServiceForm.get('price').value).toEqual('');
    expect(component.addServiceForm.get('name').value).toEqual('');
    expect(component.addServiceForm.get('nameEng').value).toEqual('');
    expect(component.addServiceForm.get('description').value).toEqual('');
    expect(component.addServiceForm.get('descriptionEng').value).toEqual('');
  });

  it('editForm() should invoke with correct parameters', () => {
    component.receivedData = {
      serviceData: {
        name: 'MockNameUA',
        nameEng: 'MockNameEng',
        description: 'MockDescrUA',
        descriptionEng: 'MockDescrEng'
      }
    };
    component.editForm();
    expect(component.addServiceForm.get('price').value).toEqual('');
    expect(component.addServiceForm.get('name').value).toEqual({ value: component.receivedData.serviceData.name });
    expect(component.addServiceForm.get('nameEng').value).toEqual({ value: component.receivedData.serviceData.nameEng });
    expect(component.addServiceForm.get('description').value).toEqual({ value: component.receivedData.serviceData.description });
    expect(component.addServiceForm.get('descriptionEng').value).toEqual(component.receivedData.serviceData.descriptionEng);
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

  it('should addNewService work correctly', () => {
    (component as any).isLangEn = true;
    component.addServiceForm.setValue({
      price: 12,
      name: 'Мок Назва',
      nameEng: 'MockNameEng',
      description: 'Мок опис',
      descriptionEng: 'MockDescrEng'
    });
    component.addNewService();
    expect(component.service).toEqual({
      price: 12,
      name: 'MockNameEng',
      nameEng: 'Мок Назва',
      description: 'MockDescrEng',
      descriptionEng: 'Мок опис'
    });
  });

  it('should set date', () => {
    component.setDate();
    expect(component.newDate).toEqual(fakeTariffService.setDate('ua'));
  });

  it('should get current language', () => {
    const result = languageServiceMock.getCurrentLanguage();
    component.setDate();
    expect(languageServiceMock.getCurrentLanguage).toHaveBeenCalled();
    expect(result).toEqual('ua');
  });

  it('should create service', () => {
    expect(fakeTariffService).toBeTruthy();
  });

  it('should be name field valid', () => {
    const nameControl = component.addServiceForm.get('name');
    const partOfName = 'asdfghjkloiuytrewquiopytrefghktasdfghjkloiuytrewquiopytreffffghg';
    nameControl.setValue(`${partOfName + partOfName + partOfName + partOfName}`);
    expect(nameControl.valid).toBe(false);
  });

  it('should return price Control on getControl', () => {
    (component as any).initForm();
    const price = component.getControl('price');
    const name = component.getControl('name');
    const nameEng = component.getControl('nameEng');
    const description = component.getControl('description');
    const descriptionEng = component.getControl('descriptionEng');
    expect(price).toEqual(component.addServiceForm.get('price'));
    expect(name).toEqual(component.addServiceForm.get('name'));
    expect(nameEng).toEqual(component.addServiceForm.get('nameEng'));
    expect(description).toEqual(component.addServiceForm.get('description'));
    expect(descriptionEng).toEqual(component.addServiceForm.get('descriptionEng'));
  });

  it('should fillFields correctly', () => {
    if (component.receivedData.serviceData) {
      component.addServiceForm.patchValue(fakeBagForm.value);
      expect(component.addServiceForm.value).toEqual(fakeBagForm.value);
    }
  });

  it('should call addNewService correctly', () => {
    const addNewServiceSpy = spyOn(component, 'addNewService');
    component.addNewService();
    fakeTariffService.createService(fakeService, 1);
    expect(addNewServiceSpy).toHaveBeenCalled();
  });

  it('should call editService correctly', () => {
    const id = 1;
    component.service = {
      name: 'Назва сервісу',
      nameEng: 'Service name',
      price: 200,
      description: 'Опис сервісу',
      descriptionEng: 'Service discr'
    };
    const editServiceSpy = spyOn(component, 'editService');
    component.editService();
    fakeTariffService.editService(component.service, id);
    expect(editServiceSpy).toHaveBeenCalled();
  });

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
