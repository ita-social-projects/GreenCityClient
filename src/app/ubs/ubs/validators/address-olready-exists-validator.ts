import { FormGroup, ValidationErrors } from '@angular/forms';
import { Language } from 'src/app/main/i18n/Language';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';

export function addressAlreadyExistsValidator(
  addresses: Address[],
  currentLanguage: Language
): (group: FormGroup) => ValidationErrors | null {
  return (group: FormGroup): ValidationErrors | null => {
    const isAlreadyExist = addresses.some((address: Address) => {
      return (
        getLangValue(address.region, address.regionEn, currentLanguage) === group.controls?.region.value &&
        getLangValue(address.city, address.cityEn, currentLanguage) === group.controls?.city.value &&
        getLangValue(address.street, address.streetEn, currentLanguage) === group.controls?.street.value &&
        address.district === group.controls?.district.value?.nameUa &&
        address.houseNumber === group.controls?.houseNumber.value &&
        address.houseCorpus === group.controls?.houseCorpus.value &&
        address.entranceNumber === group.controls?.entranceNumber.value
      );
    });

    return isAlreadyExist ? { addressAlreadyExists: true } : null;
  };
}

function getLangValue(valUA: any, valEN: any, currentLanguage: Language): any {
  return currentLanguage === Language.EN ? valEN : valUA;
}
