import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Address, LocationsDtosList } from 'src/app/ubs/ubs/models/ubs.interface';
import { AddressValidator } from 'src/app/ubs/ubs/validators/address-validators';

@Directive({
  selector: '[appValidateAddress]'
})
export class ValidateAddressDirective implements OnInit, OnChanges {
  @Input() locations: LocationsDtosList[];
  @Input() address: Address;

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    private addressValidator: AddressValidator
  ) {}

  ngOnInit(): void {
    this.validateAddress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.locations) {
      if (changes.locations.firstChange) {
        return;
      }
      this.validateAddress();
    }

    if (changes.address && !changes.address.firstChange) {
      this.validateAddress();
    }
  }
  private validateAddress(): void {
    if (!this.locations || !this.address) {
      return;
    }

    const isAvailable = this.addressValidator.isAvailable(this.locations, this.address);
    this.elementRef.nativeElement.disabled = !isAvailable;
  }
}
