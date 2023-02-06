import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { TariffsService } from '../../../../services/tariffs.service';
import { Bag } from '../../../../models/tariffs.interface';

describe('UbsAdminTariffsAddTariffServicePopupComponent', () => {
  let component: UbsAdminTariffsAddTariffServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddTariffServicePopUpComponent>;
  let fakeTariffService: TariffsService;

  const fakeBagForm = new FormGroup({
    name: new FormControl('fake'),
    nameEng: new FormControl('fake'),
    capacity: new FormControl('fake'),
    commission: new FormControl('fake'),
    price: new FormControl('fake'),
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
      declarations: [UbsAdminTariffsAddTariffServicePopUpComponent, ServerTranslatePipe, ModalTextComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }, FormBuilder, { provide: MatDialogRef, useValue: {} }],
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
    fakeTariffService.createNewTariffForService(fakeBag);
    expect(addNewTariffForServiceSpy).toHaveBeenCalled();
  });

  it('should fillFields correctly', () => {
    component.addTariffServiceForm.patchValue(fakeBagForm.value);
    expect(component.addTariffServiceForm.value).toEqual(fakeBagForm.value);
  });
});
