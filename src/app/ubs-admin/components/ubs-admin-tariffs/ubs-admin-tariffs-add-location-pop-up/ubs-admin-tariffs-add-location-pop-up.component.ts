import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-tariffs-add-location-pop-up',
  templateUrl: './ubs-admin-tariffs-add-location-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-location-pop-up.component.scss']
})
export class UbsAdminTariffsAddLocationPopUpComponent implements OnInit {
  @ViewChild('locationInput', { static: true }) input: ElementRef;
  locationForm: FormGroup;
  regionOptions;
  localityOptions;
  regionBounds;
  autocomplete;
  items = [];
  isDisabled = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UbsAdminTariffsAddLocationPopUpComponent>) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      region: [''],
      locality: ['']
    });

    this.regionOptions = {
      types: ['(regions)'],
      componentRestrictions: { country: 'UA' }
    };

    this.autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, this.localityOptions);
    this.autocomplete.addListener('place_changed', () => {
      this.addToListSelectedItem();
    });
  }

  public addToListSelectedItem() {
    if (this.input.nativeElement.value !== '') {
      this.items.push(this.input.nativeElement.value);
      this.input.nativeElement.value = '';
    }
  }

  public deleteTask(index) {
    this.items.splice(index, 1);
  }

  onRegionSelected(event) {
    const l = event.geometry.viewport.getSouthWest();
    const x = event.geometry.viewport.getNorthEast();

    this.regionBounds = new google.maps.LatLngBounds(l, x);

    this.autocomplete.setBounds(this.regionBounds);
    this.localityOptions = {
      bounds: this.regionBounds,
      strictBounds: true,
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocomplete.setOptions(this.localityOptions);
  }

  addLocation() {
    this.isDisabled = true;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
