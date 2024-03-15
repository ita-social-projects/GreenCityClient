import { ValidatorFn, ValidationErrors, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { ICourierInfo } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { Bag } from 'src/app/ubs/ubs/models/ubs.interface';

export function uniqueArrayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }

    const values = control.value as any[];
    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
      return { containDuplicates: true };
    }

    return null;
  };
}

export function courierLimitValidator(bags: Bag[], courierInfo: ICourierInfo): ValidatorFn {
  return (group: FormGroup): ValidationErrors | null => {
    for (const bag of bags.filter((el) => el.limitedIncluded)) {
      if (group.get(`quantity${bag.id}`)) {
        const quantity = +group.get(`quantity${bag.id}`)?.value;
        const validationError = validate(bag, courierInfo, quantity);

        return validationError;
      }
    }

    return null;
  };
}

function validate(bag: Bag, courierInfo: ICourierInfo, quantity: number): ValidationErrors | null {
  if (courierInfo.courierLimit === 'LIMIT_BY_AMOUNT_OF_BAG') {
    return validateAmountLimit(courierInfo, quantity);
  } else if (courierInfo.courierLimit === 'LIMIT_BY_SUM_OF_ORDER') {
    return validateSumLimit(bag, courierInfo, quantity);
  }

  return null;
}

function validateAmountLimit(courierInfo: ICourierInfo, quantity: number): ValidationErrors | null {
  if (quantity < courierInfo.min) {
    return { courierLimitError: true, message: 'order-details.min-big-bags', value: courierInfo.min };
  } else if (quantity > courierInfo.max) {
    return { courierLimitError: true, message: 'order-details.max-big-bags', value: courierInfo.max };
  }

  return null;
}

function validateSumLimit(bag: Bag, courierInfo: ICourierInfo, quantity: number): ValidationErrors | null {
  const sum = quantity * bag.price;

  if (sum < courierInfo.min) {
    return { courierLimitError: true, message: 'order-details.min-sum', value: courierInfo.min };
  } else if (sum > courierInfo.max) {
    return { courierLimitError: true, message: 'order-details.max-sum', value: courierInfo.max };
  }

  return null;
}
