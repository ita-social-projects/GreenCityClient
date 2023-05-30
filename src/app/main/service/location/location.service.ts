import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleAutoRequest, GoogleAutoService, GooglePlaceResult, GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { SearchAddress } from 'src/app/ubs/ubs/models/ubs.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  getDistrictAuto(placeDetails: GooglePlaceResult, language: string): string {
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

  getSearchAddress(cityName: string, streetName: string, houseValue: string): SearchAddress {
    const searchAddress = {
      input: `${streetName}, ${houseValue}, ${cityName}`,
      street: `${streetName}, ${houseValue}`,
      city: `${cityName},`
    };
    return searchAddress;
  }

  getCityRequest(searchAddress: string, lang: string): GoogleAutoRequest {
    const request = {
      input: searchAddress,
      language: lang,
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
    return request;
  }

  getFullAddressList(searchAddress: SearchAddress, autocompleteService: GoogleAutoService, lang: string): Observable<GooglePrediction[]> {
    const request = {
      input: searchAddress.input,
      language: lang,
      types: ['address'],
      componentRestrictions: { country: 'ua' }
    };
    return new Observable((observer) => {
      autocompleteService.getPlacePredictions(request, (housePredictions) => {
        const predictionList = housePredictions?.filter(
          (el) => el.description.includes(searchAddress.street) && el.description.includes(searchAddress.city)
        );
        if (predictionList || predictionList.length) {
          predictionList.forEach(
            (address) => (address.structured_formatting.main_text = [...address.structured_formatting.main_text.split(',')][1].trim())
          );
        }
        observer.next(predictionList);
        observer.complete();
      });
    });
  }
}
