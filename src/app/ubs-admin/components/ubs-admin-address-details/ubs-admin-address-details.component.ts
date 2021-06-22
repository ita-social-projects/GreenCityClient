import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ubs-admin-address-details',
  templateUrl: './ubs-admin-address-details.component.html',
  styleUrls: ['./ubs-admin-address-details.component.scss']
})
export class UbsAdminAddressDetailsComponent implements OnInit {
  addressDetailsForm: FormGroup;

  ngOnInit() {
    this.addressDetailsForm = new FormGroup({
      street: new FormControl(''),
      building: new FormControl(''),
      comment: new FormControl(''),
      corpus: new FormControl(''),
      entrance: new FormControl(''),
      region: new FormControl('')
    })
  }
}
