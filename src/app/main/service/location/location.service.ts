import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  getDistrictAuto(placeDetails: google.maps.places.PlaceResult, language: string): string {
    let currentDistrict;
    const searchItem = language === 'en' ? 'district' : 'район';
    const getDistrict = placeDetails.address_components.filter((item) => item.long_name.toLowerCase().includes(searchItem))[0];
    if (getDistrict) {
      currentDistrict = this.convFirstLetterToCapital(getDistrict.long_name);
      return currentDistrict;
    }
  }

  convFirstLetterToCapital(value: string): string {
    const lowerCaseVal = value.toLocaleLowerCase();
    const converted = lowerCaseVal.charAt(0).toUpperCase() + lowerCaseVal.slice(1);
    return converted;
  }

  addHouseNumToAddress(address: string, houseNumber: number): string {
    const addressArray = [...address.split(',')];
    addressArray.splice(1, 0, ' ' + houseNumber);
    const addressConverted = addressArray.join(',');
    return addressConverted;
  }
}
