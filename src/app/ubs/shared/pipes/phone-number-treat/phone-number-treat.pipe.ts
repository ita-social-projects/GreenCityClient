import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberTreat'
})
export class PhoneNumberTreatPipe implements PipeTransform {
  transform(phoneNumber: string, countryCode: string): unknown {
    const phoneAreaCodePart = phoneNumber.slice(0, 2);
    const phonePrefixPart = phoneNumber.slice(2, 5);
    const phoneFirstSubscriberPart = phoneNumber.slice(5, 7);
    const phoneSecondSubscriberPart = phoneNumber.slice(7);
    return `+${countryCode} ${phoneAreaCodePart} ${phonePrefixPart} ${phoneFirstSubscriberPart} ${phoneSecondSubscriberPart}`;
  }
}
