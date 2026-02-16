import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Address, AddressData, CourierLocations, DistrictsDtos } from 'src/app/ubs/ubs/models/ubs.interface';
import { Store } from '@ngrx/store';
import { CreateAddress, DeleteAddress, UpdateAddress } from 'src/app/store/actions/order.actions';
import { CAddressData } from 'src/app/ubs/ubs/models/ubs.model';
import { UpdateOrderAddress } from 'src/app/store/actions/bigOrderTable.actions';
import { SetCursorWaite } from 'src/app/store/actions/ubs-admin.actions';

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit {
  addAddressForm: FormGroup;
  currentLanguage: string;
  locations: CourierLocations;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UBSAddAddressPopUpComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edit: boolean;
      address: Address;
      addFromProfile?: boolean;
      addressesFromProfile?: AddressData[];
      orderId?: number;
      addressForOrder?: boolean;
    }
  ) {}

  get address() {
    return this.addAddressForm.get('address');
  }

  ngOnInit(): void {
    this.addAddressForm = this.fb.group({
      address: ['', Validators.required]
    });
    if (this.data?.address) {
      this.addAddressForm.setValue({ address: this.data.address || '' });
    }
    this.store.dispatch(SetCursorWaite({ isWaiting: false }));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteAddress(): void {
    this.store.dispatch(DeleteAddress({ address: this.data.address }));
    this.dialogRef.close('Deleted');
  }

  addAddress(): void {
    if (this.data.edit) {
      this.store.dispatch(UpdateAddress({ address: { ...this.data.address, ...this.address.value } }));
      this.dialogRef.close(this.addAddressForm.controls['address']?.value?.addressComment);
    } else {
      if (!this.data.addFromProfile) {
        this.store.dispatch(CreateAddress({ address: this.address.value, hideSuccessPopup: false }));
      }
      this.dialogRef.close({ status: 'Added', value: this.address.value });
    }
  }

  updateOrderAddress(): void {
    this.store.dispatch(
      UpdateOrderAddress({
        address: { orderAddressExportDetails: { ...this.data.address, ...this.address.value }, orderId: this.data.orderId }
      })
    );
    this.dialogRef.close('Added');
  }

  chooseActions(): void {
    this.data.addressForOrder ? this.updateOrderAddress() : this.addAddress();
  }
}
