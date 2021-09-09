import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { OrderService } from './../../../services/order.service';
import { Address } from './../../../models/ubs.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';

describe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;
  let orderService: OrderService;

  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [UBSAddAddressPopUpComponent],
      providers: [
        OrderService,
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarComponent, useValue: {} }
      ],
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

  it('method ngOnInit should set addAddressForm', () => {
    component.ngOnInit();
    expect(component.addAddressForm).toBeTruthy();
  });

  it('event onAddressChange should invoke onDistrictSelected method', () => {
    const inputElem = fixture.debugElement.query(By.css('#auto'));
    const event = new Event('onAddressChange');
    const spy = spyOn(component, 'onDistrictSelected');

    inputElem.nativeElement.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('method onAutocompleteSelected should set values and invoke setDistrict method', () => {
    const eventMock = {
      name: 'fakeName',
      address_components: ['', '', { long_name: '' }]
    };
    const regionMock = 'fakeRegion';
    const spy = spyOn(component, 'setDistrict').and.callFake(() => {});

    component.region = regionMock;
    fixture.detectChanges();
    component.onAutocompleteSelected(eventMock);

    expect(spy).toHaveBeenCalled();
    expect(component.addAddressForm.get('street').value).toBe(eventMock.name);
    expect(component.addAddressForm.get('district').value).toBe(regionMock);
  });

  it('method setDistrict should set component.region', () => {
    const eventMock = {
      longitude: 'fake1',
      latitude: 'fake2'
    };
    component.onLocationSelected(eventMock);
    expect(component.addAddressForm.get('longitude').value).toBe(eventMock.longitude);
    expect(component.addAddressForm.get('latitude').value).toBe(eventMock.latitude);
  });

  it('method onDistrictSelected should invoke three another methods, and set region to addAddressForm', () => {
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

  it('method onChange should set addAddressForm[district]', () => {
    component.onChange();
    expect(component.addAddressForm.get('district').value).toBe(component.region);
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });

  it('component function addAdress should set updatedAddresses from via orderService', () => {
    const response: Address[] = [];
    orderService = TestBed.inject(OrderService);
    spyOn(orderService, 'addAdress').and.returnValue(of(response));
    component.addAdress();
    fixture.detectChanges();
    expect(component.updatedAddresses).toEqual(response);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
