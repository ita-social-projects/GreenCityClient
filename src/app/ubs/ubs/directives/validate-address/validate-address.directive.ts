import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';
import { AddressValidator } from 'src/app/ubs/ubs/validators/address-validators';

@Directive({
  selector: '[appValidateAddress]'
})
export class ValidateAddressDirective implements OnInit, OnChanges {
  @Input() currentLocationId: number;
  @Input() address: Address;

  constructor(private elementRef: ElementRef<HTMLInputElement>, private addressValidator: AddressValidator) {}

  ngOnInit(): void {
    this.validateAddress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentLocationId.firstChange) {
      return;
    }

    if (changes.currentLocationId.previousValue !== changes.currentLocationId.currentValue) {
      this.validateAddress();
    }
  }
  private validateAddress(): void {
    if (!this.currentLocationId || !this.address) {
      return;
    }

    const isAvailable = this.addressValidator.isAvailable(this.currentLocationId, this.address);
    this.elementRef.nativeElement.disabled = !isAvailable;
  }
}
