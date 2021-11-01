import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ubs-admin-customer-details',
  templateUrl: './ubs-admin-customer-details.component.html',
  styleUrls: ['./ubs-admin-customer-details.component.scss']
})
export class UbsAdminCustomerDetailsComponent implements OnInit {
  customer: any;

  constructor(private localStorageService: LocalStorageService, private location: Location) {}

  ngOnInit(): void {
    this.customer = this.localStorageService.getCustomer();
  }

  goBack(): void {
    this.localStorageService.removeCurrentCustomer();
    this.location.back();
  }
}
