import { Injectable, Injector } from '@angular/core';
import { Coordinates } from 'src/app/greencity/modules/user/models/edit-profile.model';
import { Address, LocationsDtosList } from 'src/app/ubs/ubs/models/ubs.interface';
import { VincentySerivce } from 'src/assets/vincenty/vincenty';

enum ValidatorsRegion {
  CITY = 1,
  KYIV_REGION = 2
}

abstract class CityValidationStrategy {
  abstract isValid(address: Address): boolean;
}

class CityValidator extends CityValidationStrategy {
  constructor(private locations: LocationsDtosList[]) {
    super();
  }

  isValid(address: Address): boolean {
    return this.locations.some((l) => l.nameEn === address.cityEn);
  }
}

class KyivRegionValidator extends CityValidationStrategy {
  private vincenty: VincentySerivce;
  private readonly maxDistance = 40000;
  private readonly kyivCoordinates: Coordinates = {
    latitude: 50.45466,
    longitude: 30.5238
  };

  constructor(
    private injector: Injector,
    private locations: LocationsDtosList[]
  ) {
    super();
    this.vincenty = this.injector.get(VincentySerivce);
  }

  isValid(address: Address): boolean {
    if (this.locations.some((l) => l.nameEn === address.cityEn)) {
      return true;
    }

    if (address.coordinates.latitude === 0 && address.coordinates.longitude === 0) {
      return false;
    }

    return this.calculateDistanceToKyiv(address) <= this.maxDistance;
  }

  private calculateDistanceToKyiv(address: Address): number {
    const addressCoordinates: Coordinates = {
      latitude: address.coordinates.latitude,
      longitude: address.coordinates.longitude
    };

    return addressCoordinates.latitude ? this.vincenty.calculateEarthDistance(addressCoordinates, this.kyivCoordinates) : Number.MAX_VALUE;
  }
}

class DefaultCityValidator extends CityValidationStrategy {
  constructor() {
    super();
  }

  isValid(): boolean {
    return true;
  }
}

const validationStrategies: Record<number, (locations: LocationsDtosList[], injector?: Injector) => CityValidationStrategy> = {
  [ValidatorsRegion.CITY]: (locations: LocationsDtosList[]) => new CityValidator(locations),
  [ValidatorsRegion.KYIV_REGION]: (locations: LocationsDtosList[], injector: Injector) => new KyivRegionValidator(injector, locations)
};

@Injectable({ providedIn: 'any' })
export class AddressValidator {
  constructor(private injector: Injector) {}

  isAvailable(locations: LocationsDtosList[], address: Address): boolean {
    const strategy = validationStrategies[locations.some((location) => location.locationId === 2) ? 2 : 1];
    const validator = strategy(locations, this.injector) || new DefaultCityValidator();
    return validator.isValid(address);
  }
}
