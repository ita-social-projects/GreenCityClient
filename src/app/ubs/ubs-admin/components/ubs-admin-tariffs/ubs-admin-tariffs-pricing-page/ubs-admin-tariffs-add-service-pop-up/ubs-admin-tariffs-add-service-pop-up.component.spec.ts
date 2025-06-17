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
import { LanguageService } from 'src/app/shared/i18n/language.service';

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
    nameUk: new FormControl('fake', [Validators.required, Validators.pattern(Patterns.ServiceNamePattern), Validators.maxLength(255)]),
    nameEn: new FormControl('fake', [Validators.required, Validators.pattern(Patterns.ServiceNamePattern), Validators.maxLength(255)]),
    price: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice)]),
    description: new FormControl('fake', Validators.compose([Validators.required, Validators.maxLength(255)])),
    descriptionEng: new FormControl('fake', Validators.compose([Validators.required, Validators.maxLength(255)]))
  });

  const fakeService: Service = {
    price: 1,
    descriptionUk: 'Ua',
    descriptionEn: 'Eng',
    nameUk: 'Name',
    nameEn: 'NameEng',
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
    expect(component.addServiceForm.get('nameUk').value).toEqual('');
    expect(component.addServiceForm.get('nameEn').value).toEqual('');
    expect(component.addServiceForm.get('description').value).toEqual('');
    expect(component.addServiceForm.get('descriptionEng').value).toEqual('');
  });

  it('editForm() should invoke with correct parameters', () => {
    component.receivedData = {
      serviceData: {
        nameUk: 'MockNameUA',
        price: 1,
        nameEn: 'MockNameEng',
        descriptionUk: 'MockDescrUA',
        descriptionEn: 'MockDescrEng'
      }
    };
    component.editForm();
    expect(component.addServiceForm.get('price').value).toEqual(component.receivedData.serviceData.price);
    expect(component.addServiceForm.get('nameUk').value).toEqual(component.receivedData.serviceData.nameUk);
    expect(component.addServiceForm.get('nameEn').value).toEqual(component.receivedData.serviceData.nameEn);
    expect(component.addServiceForm.get('description').value).toEqual(component.receivedData.serviceData.descriptionUk);
    expect(component.addServiceForm.get('descriptionEng').value).toEqual(component.receivedData.serviceData.descriptionEn);
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
    const nameControl = component.addServiceForm.get('nameUk');
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
      nameUk: 'Назва сервісу',
      nameEn: 'Service name',
      price: 200,
      descriptionUk: 'Опис сервісу',
      descriptionEn: 'Service discr'
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
        component.addServiceForm.controls.nameUk.setValue(name);
        component.addServiceForm.controls.nameEn.setValue(name);
        component.addServiceForm.controls.description.setValue(name);
        component.addServiceForm.controls.descriptionEng.setValue(name);

        expect(component.addServiceForm.controls.nameUk.valid).toBeTruthy();
        expect(component.addServiceForm.controls.nameEn.valid).toBeTruthy();
        expect(component.addServiceForm.controls.description.valid).toBeTruthy();
        expect(component.addServiceForm.controls.descriptionEng.valid).toBeTruthy();
      });
    });
  });
});
