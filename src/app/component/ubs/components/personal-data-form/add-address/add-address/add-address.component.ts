import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/map/components/favorite-place/favorite-place.component';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  addAddressForm: FormGroup;
  region = '';
  districtDisabled = true;
  nextDisabled = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.addAddressForm = this.fb.group({
      city: ['Київ', Validators.required],
      district: ['', Validators.required],
      street: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9\'\,\-\ \\]+$/)
      ]],
      houseNumber: ['', Validators.required],
      houseCorpus: ['', [
        Validators.maxLength(2),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9]+$/)
      ]],
      entranceNumber: ['', [
        Validators.maxLength(2),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required]
    });
  }

  onLocationSelected(event): void {
    this.addAddressForm.get('longitude').setValue(event.longitude);
    this.addAddressForm.get('latitude').setValue(event.latitude);
  }

  onAutocompleteSelected(event): void {
    const streetName = event.name;
    this.addAddressForm.get('street').setValue(streetName);
    this.region = event.address_components[2].long_name.split(' ')[1] === 'район'
      ? event.address_components[2].long_name.split(' ')[0] : null;
    this.addAddressForm.get('district').setValue(this.region);
    this.nextDisabled = false;
    this.districtDisabled = event.address_components[2].long_name.split(' ')[1] === 'район' ? true : false;
  }

  onDistrictSelected(event): void {
    this.region = event.address_components[0].long_name.split(' ')[0];
    this.addAddressForm.get('district').setValue(this.region);
    this.districtDisabled = true;
    this.nextDisabled = false;
  }

  onChange(): void {
    this.region = null;
    this.addAddressForm.get('district').setValue(this.region);
    this.districtDisabled = false;
    this.nextDisabled = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
