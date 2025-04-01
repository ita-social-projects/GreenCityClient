import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { UbsOrderAddressComponent } from './ubs-order-address.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AddressValidator } from 'src/app/ubs/ubs/validators/address-validators';
import { Address } from '@ubs/ubs/models/ubs.interface';

describe('UbsOrderAddressComponent', () => {
  let component: UbsOrderAddressComponent;
  let fixture: ComponentFixture<UbsOrderAddressComponent>;
  let storeMock: any;
  let dialogMock: any;
  let routeMock: any;

  const addressValidatorMock = {
    isAvailable: jasmine.createSpy('isAvailable').and.returnValue(true)
  };

  beforeEach(waitForAsync(() => {
    storeMock = {
      dispatch: jasmine.createSpy(),
      select: jasmine.createSpy().and.returnValue(of([])),
      pipe: jasmine.createSpy().and.returnValue(of([]))
    };

    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of({})
      })
    };

    routeMock = {
      queryParams: of({})
    };

    TestBed.configureTestingModule({
      declarations: [UbsOrderAddressComponent, SpinnerComponent],
      imports: [TranslateModule.forRoot(), MatProgressSpinnerModule, ReactiveFormsModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
          provide: ActivatedRoute,
          useValue: routeMock
        },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Store, useValue: storeMock },
        { provide: AddressValidator, useValue: addressValidatorMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderAddressComponent);
    component = fixture.componentInstance;
    spyOn(component, 'setCurrentAddress');
    spyOn(component, 'findAvailableAddress');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when existingOrderId is present in params', () => {
    beforeEach(() => {
      routeMock.queryParams = of({ existingOrderId: '123' });
    });

    it('should initialize listeners for existing order', () => {
      spyOn(component, 'initListenersForExistingOrder');
      component.ngOnInit();
      expect(component.initListenersForExistingOrder).toHaveBeenCalled();
    });
  });

  describe('when existingOrderId is NOT present in params', () => {
    beforeEach(() => {
      routeMock.queryParams = of({});
    });

    it('should initialize listeners for new order', () => {
      spyOn(component, 'initListenersForNewOrder');
      component.ngOnInit();
      expect(component.initListenersForNewOrder).toHaveBeenCalled();
    });
  });

  it('should dispatch GetAddresses on initialization', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should open the address dialog for editing', () => {
    component.openDialog(true, 1);
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should open the address dialog for adding a new address', () => {
    component.openDialog(false);
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should check if address is available', () => {
    const address = { id: 1 };
    const result = component.isAddressAvailable(address as any);
    expect(result).toBeTrue();
    expect(addressValidatorMock.isAvailable).toHaveBeenCalled();
  });

  it('should change address comment and dispatch update action', () => {
    component.selectedAddress = { id: 1, addressComment: 'old comment' } as any;
    component.addressComment.setValue('new comment');
    component.changeAddressComment();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should dispatch DeleteAddress on deleteAddress', () => {
    const address = { id: 1 };
    component.deleteAddress(address as any);
    expect(storeMock.dispatch).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should disable the address comment input if selectedAddress is null', () => {
    component.selectedAddress = null;
    component.ngOnInit();
    expect(component.addressComment.disabled).toBeTrue();
  });

  describe('initLocation', () => {
    it('should clear selectedAddress when addresses array is empty', () => {
      component.addresses = [];
      component.selectedAddress = { id: 1 } as Address;

      component.initLocation();

      expect(component.selectedAddress).toBeNull();
      expect(component.setCurrentAddress).not.toHaveBeenCalled();
      expect(component.findAvailableAddress).not.toHaveBeenCalled();
    });

    it('should use the valid selectedAddress if available', () => {
      const validAddress: Address = { id: 1 } as Address;
      component.addresses = [validAddress, { id: 2 } as Address];
      component.selectedAddress = validAddress;

      spyOn(component, 'isAddressAvailable').and.returnValue(true);

      component.initLocation();

      expect(component.setCurrentAddress).toHaveBeenCalledWith(validAddress);
      expect(component.findAvailableAddress).not.toHaveBeenCalled();
    });

    it('should reset selectedAddress and use available actual address when selectedAddress is invalid', () => {
      const invalidAddress: Address = { id: 1 } as Address;
      const actualAddress: Address = { id: 2, actual: true } as Address;
      component.addresses = [invalidAddress, actualAddress];
      component.selectedAddress = invalidAddress;

      spyOn(component, 'isAddressAvailable').and.callFake((address: Address) => address.id === actualAddress.id);

      component.initLocation();

      expect(component.selectedAddress).toBeNull();
      expect(component.setCurrentAddress).toHaveBeenCalledWith(actualAddress);
      expect(component.findAvailableAddress).not.toHaveBeenCalled();
    });

    it('should call findAvailableAddress when no valid address is found', () => {
      const invalidAddress: Address = { id: 1 } as Address;
      component.addresses = [invalidAddress];
      component.selectedAddress = invalidAddress;

      spyOn(component, 'isAddressAvailable').and.returnValue(false);

      component.initLocation();

      expect(component.selectedAddress).toBeNull();
      expect(component.setCurrentAddress).not.toHaveBeenCalled();
      expect(component.findAvailableAddress).toHaveBeenCalled();
    });
  });
});
