import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';

@Component({
  selector: 'app-ubs-admin-address-details',
  templateUrl: './ubs-admin-address-details.component.html',
  styleUrls: ['./ubs-admin-address-details.component.scss']
})
export class UbsAdminAddressDetailsComponent {
  @Input() addressExportDetailsDto: FormControl;
  @Input() address: Address;
  pageOpen: boolean;
  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }
}
