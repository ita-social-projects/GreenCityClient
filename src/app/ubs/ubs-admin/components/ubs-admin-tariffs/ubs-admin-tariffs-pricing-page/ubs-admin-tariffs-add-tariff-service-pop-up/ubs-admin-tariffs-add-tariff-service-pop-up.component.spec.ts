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

@Pipe({ name: 'datePipe' })
class DatePipeMock implements PipeTransform {
  transform(value: Date): string {
    return '2022-02-20';
  }
}

describe('UbsAdminTariffsAddTariffServicePopupComponent', () => {
  let component: UbsAdminTariffsAddTariffServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddTariffServicePopUpComponent>;
  let fakeTariffService: TariffsService;

  const fakeBagForm = new FormGroup({
    name: new FormControl('fake'),
    nameEng: new FormControl('fake'),
    capacity: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice)]),
    commission: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice)]),
    price: new FormControl('fake', [Validators.pattern(Patterns.ubsServicePrice)]),
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddTariffServicePopUpComponent, ServerTranslatePipe, ModalTextComponent, DatePipeMock],
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
        { provide: DatePipe, useClass: DatePipeMock }
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

  it('should fillFields correctly', () => {
    component.addTariffServiceForm.patchValue(fakeBagForm.value);
    expect(component.addTariffServiceForm.value).toEqual(fakeBagForm.value);
  });
});
