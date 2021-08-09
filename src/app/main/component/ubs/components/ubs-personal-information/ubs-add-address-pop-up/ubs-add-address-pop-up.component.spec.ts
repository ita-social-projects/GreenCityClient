import { OrderService } from './../../../services/order.service';
import { Address } from './../../../models/ubs.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

fdescribe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;
  let orderService: OrderService;

  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [UBSAddAddressPopUpComponent],
      providers: [OrderService, { provide: MatDialogRef, useValue: fakeMatDialogRef }, { provide: MAT_DIALOG_DATA, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSAddAddressPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('function ngOnInit should set addAddressForm', () => {
    component.ngOnInit();
    expect(component.addAddressForm).toBeTruthy();
  });

  it('event onAddressChange should invoke onDistrictSelected function', () => {
    const inputElem = fixture.debugElement.query(By.css('#auto'));
    const event = new Event('onAddressChange');
    const spy = spyOn(component, 'onDistrictSelected');

    inputElem.nativeElement.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  // need to fix onAutocompleteSelected function
  xit('fucntion onAutocompleteSelected should set values and invoke setDistrict function', () => {
    const eventMock = {
      name: 'fakeName'
    };
    const regionMock = 'fakeRegion';
    const spy = spyOn(component, 'setDistrict').and.callFake(() => {});

    fixture.detectChanges();
    component.onAutocompleteSelected(eventMock);

    expect(spy).toHaveBeenCalled();
    expect(component.addAddressForm.get('street').value).toBe(eventMock.name);
    expect(component.addAddressForm.get('district').value).toBe(regionMock);
  });

  it('fucntion setDistrict should set component.region', () => {
    const eventMock = {
      longitude: 'fake1',
      latitude: 'fake2'
    };
    component.onLocationSelected(eventMock);
    expect(component.addAddressForm.get('longitude').value).toBe(eventMock.longitude);
    expect(component.addAddressForm.get('latitude').value).toBe(eventMock.latitude);
  });

  it('fucntion onDistrictSelected should invoke three another functions, and set region to addAddressForm', () => {
    const eventMock = [];
    const spy1 = spyOn(component, 'onLocationSelected');
    const spy2 = spyOn(component, 'setDistrict');
    const spy3 = spyOn(component, 'onAutocompleteSelected');

    component.onDistrictSelected(eventMock);

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component.addAddressForm.get('district').value).toBe(component.region);
  });

  it('function onChange should set addAddressForm[district]', () => {
    component.onChange();
    expect(component.addAddressForm.get('district').value).toBe(component.region);
  });

  it('function onNoClick should invoke destroyRef.close()', () => {
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });

  it('component function addAdress should set updatedAddresses from via orderService', async(() => {
    const response: Address[] = [];
    orderService = TestBed.inject(OrderService);
    spyOn(orderService, 'addAdress').and.returnValue(of(response));
    component.addAdress();
    fixture.detectChanges();
    expect(component.updatedAddresses).toEqual(response);
  }));

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    component['destroy'].subscribe();
    component.ngOnDestroy();
    expect(component['destroy'].closed).toBeTruthy();
  });
});
