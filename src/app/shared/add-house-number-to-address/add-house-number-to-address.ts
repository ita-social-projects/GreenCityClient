import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddHouseNumberToAddressService {
  public addHouseNumToAddress(address: string, houseNumber: number): string {
    const addressArray = [...address.split(',')];
    addressArray.splice(1, 0, ' ' + houseNumber);
    const addressConverted = addressArray.join(',');
    return addressConverted;
  }
}
