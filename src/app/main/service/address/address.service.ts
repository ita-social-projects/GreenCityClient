import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  isLocationAdded: boolean = false;

  setIsLocationAdded(value: boolean): void {
    this.isLocationAdded = value;
  }

  getIsLocationAdded(): boolean {
    return this.isLocationAdded;
  }
}
