import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function quillEditorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    console.log(value);
    if (!value) {
      return null;
    }
    return value.length >= 20 ? null : { enoughCharacters: false };
  };
}
