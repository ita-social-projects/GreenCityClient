import { Directive } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimValue]'
})
export class TrimValueDirective {
  constructor(private ngControl: NgControl) {
    trimValueAccessor(ngControl.valueAccessor);
  }
}

function trimValueAccessor(valueAccessor: ControlValueAccessor) {
  const original = valueAccessor.registerOnChange;

  valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
    return original.call(valueAccessor, (value: unknown) => {
      if (typeof value === 'string') {
        value = value.replace(/\s+/g, ' ').trim();
      }
      return fn(value);
    });
  };
}
