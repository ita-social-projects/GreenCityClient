import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-tariffs-add-location-pop-up',
  templateUrl: './ubs-admin-tariffs-add-location-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-location-pop-up.component.scss']
})
export class UbsAdminTariffsAddLocationPopUpComponent implements OnInit {
  locationForm: FormGroup;
  streetPattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ.\'\-\ \\]+[A-Za-zА-Яа-яїЇіІєЄёЁ0-9.\'\-\ \\]*$/;
  regionOptions;
  localityOptions;
  city = '';
  input;
  emptyRegionMessage = false;
  inputLength = 0;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UbsAdminTariffsAddLocationPopUpComponent>) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      region: ['', Validators.required],
      locality: ['', Validators.required]
    });
    this.regionOptions = {
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
  }

  onCitySelected(event) {
    const cityName = event.name;
    this.locationForm.get('city').setValue(cityName);
  }

  checkQuantityOfLetters(event) {
    this.input = document.querySelectorAll('.pac-container');
    if (event?.length < 3) {
      this.input.style.visibility = 'hidden';
    } else {
      this.input.style.visibility = 'visible';
    }
    this.inputLength = event?.length;
    if (this.inputLength > 0) this.emptyRegionMessage = false;
  }

  addLocation() {
    if (this.inputLength == 0) this.emptyRegionMessage = true;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
