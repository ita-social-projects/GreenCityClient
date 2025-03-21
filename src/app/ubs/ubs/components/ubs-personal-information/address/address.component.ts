import { Component, Input } from '@angular/core';
import { Address } from '@ubs/ubs/models/ubs.interface';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {
  @Input() address: Address;
}
