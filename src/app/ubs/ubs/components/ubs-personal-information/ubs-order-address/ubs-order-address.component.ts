import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { DeleteAddress, GetAddresses, SetAddress, UpdateAddress } from 'src/app/store/actions/order.actions';
import {
  addressesSelector,
  existingOrderInfoSelector,
  isAddressLoadingSelector,
  locationIdSelector
} from 'src/app/store/selectors/order.selectors';
import { IAddressExportDetails, IUserOrderInfo } from 'src/app/ubs/ubs-user/ubs-user-orders-list/models/UserOrder.interface';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';
import { AddressValidator } from 'src/app/ubs/ubs/validators/address-validators';

@Component({
  selector: 'app-ubs-order-address',
  templateUrl: './ubs-order-address.component.html',
  styleUrls: ['./ubs-order-address.component.scss']
})
export class UbsOrderAddressComponent implements OnInit, OnDestroy {
  selectedAddress: Address;
  addressComment: FormControl = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  addresses: Address[] = [];
  currentLocationId: number;
  existingOrderInfo: IUserOrderInfo;
  maxAddressLength = 4;
  $isAddressLoading = this.store.pipe(select(isAddressLoadingSelector));
  private $destroy: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private addressValidator: AddressValidator, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(GetAddresses());
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      params.existingOrderId ? this.initListenersForExistingOrder() : this.initListenersForNewOrder();
    });

    this.addressComment.disable();
  }

  initListenersForNewOrder(): void {
    combineLatest([
      this.store.pipe(
        select(locationIdSelector),
        filter((value) => value !== null)
      ),
      this.store.pipe(select(addressesSelector), filter(Boolean))
    ])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([locationId, addresses]: [number, Address[]]) => {
        this.addresses = addresses;
        this.currentLocationId = locationId;
        this.initLocation();
      });
  }

  initListenersForExistingOrder(): void {
    combineLatest([
      this.store.pipe(
        select(locationIdSelector),
        filter((value) => value !== null)
      ),
      this.store.pipe(select(addressesSelector), filter(Boolean)),
      this.store.pipe(select(existingOrderInfoSelector), filter(Boolean))
    ])
      .pipe(takeUntil(this.$destroy))
      .subscribe(([locationId, addresses, orderInfo]: [number, Address[], IUserOrderInfo]) => {
        this.addresses = addresses;
        this.currentLocationId = locationId;
        this.existingOrderInfo = orderInfo;
        this.initLocationForExistingOrder();
      });
  }

  initLocation(): void {
    let address = this.selectedAddress && this.isAddressAvailable(this.selectedAddress) ? this.selectedAddress : null;

    if (!address) {
      const actualAddress = this.addresses.find((address) => address.actual);
      address = actualAddress && this.isAddressAvailable(actualAddress) ? actualAddress : null;
    }

    address ? this.setCurrentAddress(address) : this.findAvailableAddress();
  }

  findAvailableAddress(): void {
    for (const address of this.addresses) {
      if (this.isAddressAvailable(address)) {
        this.setCurrentAddress(address);
        return;
      }
    }

    this.setCurrentAddress(null);
  }

  initLocationForExistingOrder(): void {
    const addressDetails: IAddressExportDetails = this.existingOrderInfo.address;
    const address = this.addresses.find(
      (address) =>
        address.cityEn === addressDetails.addressCityEng &&
        address.regionEn === addressDetails.addressRegionEng &&
        address.streetEn === addressDetails.addressStreetEng &&
        address.districtEn === addressDetails.addressDistinctEng &&
        address.houseNumber === addressDetails.houseNumber
    );

    address && this.isAddressAvailable(address) ? this.setCurrentAddress(address) : this.initLocation();
  }

  setCurrentAddress(address): void {
    this.selectedAddress = address;
    this.addressComment.patchValue(address?.addressComment ?? '');
    this.store.dispatch(SetAddress({ address: address }));

    address ? this.addressComment.enable() : this.addressComment.disable();
  }

  isAddressAvailable(address: Address): boolean {
    return this.addressValidator.isAvailable(this.currentLocationId, address);
  }

  isAddressDisabled(address: Address): boolean {
    return !this.isAddressAvailable(address);
  }

  changeAddressComment(): void {
    if (this.addressComment.value !== this.selectedAddress.addressComment) {
      this.store.dispatch(UpdateAddress({ address: { ...this.selectedAddress, addressComment: this.addressComment.value } }));
    }
  }

  deleteAddress(address: Address): void {
    this.store.dispatch(DeleteAddress({ address }));
  }

  addNewAddress(): void {
    this.openDialog(false);
  }

  editAddress(addressId: number): void {
    this.openDialog(true, addressId);
  }

  openDialog(isEdit: boolean, addressId?: number): void {
    const currentAddress = this.addresses.find((address) => address.id === addressId);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: isEdit
    };
    if (isEdit) {
      dialogConfig.data.address = currentAddress;
    } else {
      dialogConfig.data.address = {};
    }
    const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {});
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
