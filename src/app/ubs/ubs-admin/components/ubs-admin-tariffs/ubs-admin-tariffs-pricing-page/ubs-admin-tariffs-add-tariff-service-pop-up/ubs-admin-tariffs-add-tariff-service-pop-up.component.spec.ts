import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { of } from 'rxjs';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';

describe('UbsAdminTariffsAddTariffServicePopupComponent', () => {
  let component: UbsAdminTariffsAddTariffServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddTariffServicePopUpComponent>;

  const fakeBagForm = new FormGroup({
    name: new FormControl('fake'),
    nameEng: new FormControl('fake'),
    price: new FormControl('fake'),
    capacity: new FormControl('fake'),
    commission: new FormControl('fake'),
    description: new FormControl('fake'),
    englishDescription: new FormControl('fake')
  });

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

  it('should fillFields correctly', () => {
    component.addTariffServiceForm.patchValue(fakeBagForm.value);
    expect(component.addTariffServiceForm.value).toEqual(fakeBagForm.value);
  });

  it('should call createAndStoreNewTariff correctly', () => {
    const spy = spyOn(component, 'createAndStoreNewTariff');
    component.createAndStoreNewTariff();
    expect(spy).toHaveBeenCalled();
  });
});
