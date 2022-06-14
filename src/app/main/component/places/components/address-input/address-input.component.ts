import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor {
  public value: string | undefined;
  public onTouched!: () => void;
  private onChange!: (value: string) => void;
  @Output() private getAddressData: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public writeValue(value: string): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  selectAddressApi(event: any) {
    this.getAddressData.emit(event);
  }

  setAddressValue(event: any): void {
    const content = event.formatted_address;
    this.onChange(content);
    this.onTouched();
    this.value = content;
  }
}
