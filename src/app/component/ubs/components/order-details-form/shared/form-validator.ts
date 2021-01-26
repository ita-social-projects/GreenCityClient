import { AbstractControl } from "@angular/forms";

export function wrongAmountValidator(control: AbstractControl): {[key: string]: any} | null {
  const wrong = /1/.test(control.value);
  return wrong ? {'wrongAmount': {value: control.value}} : null;
}
