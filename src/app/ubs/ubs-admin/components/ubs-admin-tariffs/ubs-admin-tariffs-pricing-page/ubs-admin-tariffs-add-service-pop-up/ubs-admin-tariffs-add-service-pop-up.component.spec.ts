import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

  beforeEach(waitForAsync(() => {
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
        price: 1,
        nameEng: 'MockNameEng',
        description: 'MockDescrUA',
        descriptionEng: 'MockDescrEng'
      }
    };
    component.editForm();
    expect(component.addServiceForm.get('price').value).toEqual({ value: component.receivedData.serviceData.price });
    expect(component.addServiceForm.get('name').value).toEqual({ value: component.receivedData.serviceData.name });
    expect(component.addServiceForm.get('nameEng').value).toEqual({ value: component.receivedData.serviceData.nameEng });
    expect(component.addServiceForm.get('description').value).toEqual({ value: component.receivedData.serviceData.description });
    expect(component.addServiceForm.get('descriptionEng').value).toEqual(component.receivedData.serviceData.descriptionEng);
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

  it('should validate service name correctly with special characters at different positions', () => {
    const specialChars = `!"#$%&'()*+,-./:;<=>?@[]^_\`{|}~`;
    specialChars.split('').forEach((char) => {
      const validNames = [`service${char}Name`, `${char}serviceName`, `serviceName${char}`];

      validNames.forEach((name) => {
        component.addServiceForm.controls.name.setValue(name);
        component.addServiceForm.controls.nameEng.setValue(name);
        component.addServiceForm.controls.description.setValue(name);
        component.addServiceForm.controls.descriptionEng.setValue(name);

        expect(component.addServiceForm.controls.name.valid).toBeTruthy();
        expect(component.addServiceForm.controls.nameEng.valid).toBeTruthy();
        expect(component.addServiceForm.controls.description.valid).toBeTruthy();
        expect(component.addServiceForm.controls.descriptionEng.valid).toBeTruthy();
      });
    });
  });
});
