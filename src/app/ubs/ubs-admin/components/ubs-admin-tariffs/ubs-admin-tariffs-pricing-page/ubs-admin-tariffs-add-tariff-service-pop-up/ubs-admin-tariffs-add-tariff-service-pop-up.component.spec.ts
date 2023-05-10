import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { TariffsService } from '../../../../services/tariffs.service';
import { Bag } from '../../../../models/tariffs.interface';
import { Patterns } from '../../../../../../../assets/patterns/patterns';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { LanguageService } from 'src/app/main/i18n/language.service';

describe('UbsAdminTariffsAddTariffServicePopupComponent', () => {
  let component: UbsAdminTariffsAddTariffServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddTariffServicePopUpComponent>;
  let fakeTariffService: TariffsService;
  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  const fakeBagForm = new FormGroup({
    name: new FormControl('fake', [Validators.required, Validators.pattern(Patterns.NamePattern), Validators.maxLength(30)]),
    nameEng: new FormControl('fake', [Validators.required, Validators.pattern(Patterns.NamePattern), Validators.maxLength(30)]),
    capacity: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice), Validators.min(1), Validators.max(999)]),
    commission: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice)]),
    price: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice), Validators.min(1), Validators.max(999999.99)]),
    description: new FormControl('fake'),
    descriptionEng: new FormControl('fake')
  });

  const fakeBag: Bag = {
    capacity: 150,
    price: 50,
    locationId: 2,
    commission: 5,
    tariffTranslationDtoList: {
      name: 'Name',
      description: 'adsaasdadsad',
      descriptionEng: 'asdssadads',
      nameEng: 'NameEng'
    }
  };

  const fakeReceivedData = {
    bagData: {
      capacity: 77,
      commission: 89,
      description: 'Тест опис',
      descriptionEng: 'Test descr',
      fullPrice: 989,
      id: 20,
      limitIncluded: false,
      name: 'Пластик',
      nameEng: 'Plastic',
      price: 900
    },
    button: 'update'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddTariffServicePopUpComponent, ServerTranslatePipe, ModalTextComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        BrowserModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        FormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: LanguageService, useValue: languageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsAddTariffServicePopUpComponent);
    component = fixture.componentInstance;
    fakeTariffService = TestBed.inject(TariffsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it(`setDate should be called in ngOnInit`, () => {
    const setDateSpy = spyOn(component as any, 'setDate');
    component.ngOnInit();
    expect(setDateSpy).toHaveBeenCalled();
  });

  it(`editForm should be called in initForm`, () => {
    component.receivedData.bagData = fakeBag;
    const editFormSpy = spyOn(component as any, 'editForm');
    (component as any).initForm();
    expect(editFormSpy).toHaveBeenCalled();
  });

  it(`addForm should be called in initForm`, () => {
    component.receivedData.bagData = !fakeBag;
    const addFormSpy = spyOn(component as any, 'addForm');
    (component as any).initForm();
    expect(addFormSpy).toHaveBeenCalled();
  });

  it(`setDate should be called in ngOnInit`, () => {
    const setDateSpy = spyOn(component as any, 'setDate');
    component.ngOnInit();
    expect(setDateSpy).toHaveBeenCalled();
  });

  it('should be valid if form value is valid', () => {
    component.addTariffServiceForm.setValue({
      price: 120,
      name: 'Мок Назва',
      nameEng: 'MockNameEng',
      description: 'Мок опис',
      descriptionEng: 'MockDescrEng',
      capacity: 77,
      commission: 89
    });
    expect(component.addTariffServiceForm.valid).toEqual(true);
  });

  it('should be valid if form value is valid', () => {
    component.addTariffServiceForm.setValue({
      price: 1,
      description: 'Ua',
      descriptionEng: 'Eng',
      name: '',
      nameEng: '',
      capacity: 77,
      commission: 89
    });
    expect(component.addTariffServiceForm.valid).toEqual(false);
  });

  it('should be commission field valid value less 999999.99', () => {
    const commissionControl = component.addTariffServiceForm.get('commission');
    commissionControl.setValue(500);
    expect(commissionControl.valid).toBeTruthy();
  });

  it('should return input value Control on getControl', () => {
    (component as any).initForm();
    const name = component.getControl('name');
    const nameEng = component.getControl('nameEng');
    const commission = component.getControl('commission');
    const capacity = component.getControl('capacity');
    const description = component.getControl('description');
    const descriptionEng = component.getControl('descriptionEng');
    const price = component.getControl('price');
    expect(name).toEqual(component.addTariffServiceForm.get('name'));
    expect(nameEng).toEqual(component.addTariffServiceForm.get('nameEng'));
    expect(commission).toEqual(component.addTariffServiceForm.get('commission'));
    expect(capacity).toEqual(component.addTariffServiceForm.get('capacity'));
    expect(description).toEqual(component.addTariffServiceForm.get('description'));
    expect(descriptionEng).toEqual(component.addTariffServiceForm.get('descriptionEng'));
    expect(price).toEqual(component.addTariffServiceForm.get('price'));
  });

  it('component should initialize createTariffService form from with correct parameters', () => {
    (component as any).createTariffService();
    expect(component.addTariffServiceForm.get('name').value).toEqual('');
    expect(component.addTariffServiceForm.get('nameEng').value).toEqual('');
    expect(component.addTariffServiceForm.get('price').value).toEqual('');
    expect(component.addTariffServiceForm.get('description').value).toEqual('');
    expect(component.addTariffServiceForm.get('descriptionEng').value).toEqual('');
    expect(component.addTariffServiceForm.get('capacity').value).toEqual('');
    expect(component.addTariffServiceForm.get('commission').value).toEqual('');
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

  it('should call addTariffForNewService correctly', () => {
    const addNewTariffForServiceSpy = spyOn(component, 'addNewTariffForService');
    component.addNewTariffForService();
    fakeTariffService.createNewTariffForService(fakeBag, 1);
    expect(addNewTariffForServiceSpy).toHaveBeenCalled();
  });

  it('should addTariffForNewService work correctly', () => {
    (component as any).isLangEn = true;
    component.addTariffServiceForm.setValue({
      price: 12,
      name: 'Мок Назва',
      nameEng: 'MockNameEng',
      description: 'Мок опис',
      descriptionEng: 'MockDescrEng',
      capacity: 77,
      commission: 89
    });
    component.addNewTariffForService();
    expect(component.tariffService).toEqual({
      price: 12,
      name: 'MockNameEng',
      nameEng: 'Мок Назва',
      description: 'MockDescrEng',
      descriptionEng: 'Мок опис',
      capacity: 77,
      commission: 89
    });
  });

  it('should call editTariffForService correctly', () => {
    const tariffService = {
      name: 'Назва тарифу',
      nameEng: 'Tariff name',
      capacity: 55,
      price: 100,
      commission: 20,
      description: 'Опис тарифу',
      descriptionEng: 'Tariff discr',
      langCode: 'en'
    };
    const editTariffForServiceSpy = spyOn(component, 'editTariffForService');
    component.editTariffForService(fakeReceivedData);
    fakeTariffService.editTariffForService(fakeReceivedData.bagData.id, tariffService);
    expect(editTariffForServiceSpy).toHaveBeenCalled();
  });

  it('should fillFields correctly', () => {
    component.addTariffServiceForm.patchValue(fakeBagForm.value);
    expect(component.addTariffServiceForm.value).toEqual(fakeBagForm.value);
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

  it('editForm() should invoke with correct parameters', () => {
    component.receivedData = {
      bagData: {
        name: 'MockNameUA',
        nameEng: 'MockNameEng',
        description: 'MockDescrUA',
        descriptionEng: 'MockDescrEng'
      }
    };
    component.editForm();
    expect(component.addTariffServiceForm.get('price').value).toEqual('');
    expect(component.addTariffServiceForm.get('name').value).toEqual({ value: component.receivedData.bagData.name });
    expect(component.addTariffServiceForm.get('nameEng').value).toEqual({ value: component.receivedData.bagData.nameEng });
    expect(component.addTariffServiceForm.get('description').value).toEqual({ value: component.receivedData.bagData.description });
    expect(component.addTariffServiceForm.get('descriptionEng').value).toEqual({ value: component.receivedData.bagData.descriptionEng });
    expect(component.addTariffServiceForm.get('capacity').value).toEqual({ value: component.receivedData.bagData.capacity });
    expect(component.addTariffServiceForm.get('commission').value).toEqual('');
  });
});
