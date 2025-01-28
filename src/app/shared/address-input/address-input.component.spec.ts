import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressInputComponent } from './address-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { AddressService } from '../services/address/address.service';
import { of } from 'rxjs';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: LanguageService, useValue: { getLangValue: () => {} } },
        { provide: LocalStorageService, useValue: { getLocations: () => {}, getCurrentLanguage: () => {} } },
        { provide: AddressService, useValue: { validateAddress: () => of(true) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required fields', () => {
    expect(component.addressForm.contains('region')).toBeTrue();
    expect(component.addressForm.contains('city')).toBeTrue();
    expect(component.addressForm.contains('street')).toBeTrue();
    expect(component.addressForm.contains('houseNumber')).toBeTrue();
    expect(component.addressForm.contains('district')).toBeTrue();
  });

  it('should require region field', () => {
    const regionControl = component.addressForm.get('region');
    regionControl.setValue('');
    expect(regionControl.valid).toBeFalse();
    expect(regionControl.hasError('required')).toBeTrue();
  });

  it('should validate houseNumber with pattern', () => {
    const houseNumberControl = component.addressForm.get('houseNumber');
    houseNumberControl.setValue('1234');
    expect(houseNumberControl.valid).toBeTrue();

    houseNumberControl.setValue('abcd');
    expect(houseNumberControl.valid).toBeFalse();
    expect(houseNumberControl.hasError('pattern')).toBeTrue();
  });

  it('should disable fields when isUneditableStatus is true', () => {
    component.isUneditableStatus = true;
    component.ngAfterViewInit();

    expect(component.region.disabled).toBeTrue();
    expect(component.city.disabled).toBeTrue();
    expect(component.street.disabled).toBeTrue();
  });

  it('should enable fields when isUneditableStatus is false', () => {
    component.isUneditableStatus = false;
    component.ngAfterViewInit();

    expect(component.region.disabled).toBeFalse();
    expect(component.city.disabled).toBeFalse();
    expect(component.street.disabled).toBeFalse();
  });

  it('should set initial values when address is provided', () => {
    component.address = {
      id: 1,
      region: 'Kyiv Region',
      city: 'Kyiv',
      street: 'Khreshchatyk',
      houseNumber: '10',
      district: 'Shevchenkivskyi'
    } as any;

    component.initForm();
    expect(component.addressForm.get('region').value).toBe('Kyiv Region');
    expect(component.addressForm.get('city').value).toBe('Kyiv');
    expect(component.addressForm.get('street').value).toBe('Khreshchatyk');
    expect(component.addressForm.get('houseNumber').value).toBe('10');
  });

  it('should validate the entire form as invalid if required fields are empty', () => {
    component.addressForm.reset();
    expect(component.addressForm.valid).toBeFalse();
  });
});
