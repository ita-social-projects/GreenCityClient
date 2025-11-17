import { FormGroup, ValidationErrors } from '@angular/forms';
import { Language } from 'src/app/shared/i18n/Language';
import { Address, AddressData } from 'src/app/ubs/ubs/models/ubs.interface';

export function addressAlreadyExistsValidator(
  addresses: Address[] | AddressData[],
  currentLanguage: Language,
  formAddressChangeId: number | string
): (group: FormGroup) => ValidationErrors | null {
  return (group: FormGroup): ValidationErrors | null => {
    const isAlreadyExist = addresses.some((address, i) => {
      if (i === formAddressChangeId && formAddressChangeId) {
        return false;
      }

      return (
        getLangValue(address.regionUk, address.regionEn, currentLanguage) === group.controls?.region.value &&
        getLangValue(address.cityUk, address.cityEn, currentLanguage) === group.controls?.city.value &&
        getLangValue(address.streetUk, address.streetEn, currentLanguage) === group.controls?.street.value &&
        address.houseNumber === group.controls?.houseNumber.value &&
        compareIfExist(group.controls?.houseCorpus.value, address.houseCorpus) &&
        compareIfExist(group.controls?.entranceNumber.value, address.entranceNumber) &&
        compareIfExist(group.controls?.addressComment.value, address.addressComment) &&
        (address.districtUk === group.controls?.district.value?.nameUk ||
          address.districtEn === group.controls?.district.value?.nameEn ||
          address.districtUk === group.controls?.district.value ||
          address.districtEn === group.controls?.district.value)
      );
    });

    return isAlreadyExist ? { addressAlreadyExists: true } : null;
  };
}

function getLangValue(valUA: any, valEN: any, currentLanguage: Language): any {
  return currentLanguage === Language.EN ? valEN : valUA;
}

function compareIfExist(value: string | null, compareTo: string | null): boolean {
  if (!value && !compareTo) {
    return true;
  }

  return value === compareTo;
}
