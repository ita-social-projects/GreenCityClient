import { Injectable, Injector } from '@angular/core';
import { Coordinates } from '@global-user/models/edit-profile.model';
import { Language } from 'src/app/main/i18n/Language';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';
import { Locations } from 'src/assets/locations/locations';
import { VincentySerivce } from 'src/assets/vincenty/vincenty';

enum ValidatorsRegion {
  KYIV = 1,
  KYIV_REGION = 2
}

abstract class CityValidationStrategy {
  constructor(protected injector: Injector) {}

  abstract isValid(address: Address): boolean;
}

class KyivValidator extends CityValidationStrategy {
  private locations: Locations;
  private cities: string[];

  constructor(protected injector: Injector) {
    super(injector);
    this.locations = this.injector.get(Locations);
    this.cities = this.locations.getCity(Language.EN).map((city) => city.cityName);
  }

  isValid(address: Address): boolean {
    return this.cities.includes(address.cityEn);
  }
}

class KyivRegionValidator extends CityValidationStrategy {
  private locations: Locations;
  private cities: string[];
  private vincenty: VincentySerivce;
  private readonly maxDistance = 40000;
  private readonly kyivCoordinates: Coordinates = {
    latitude: 50.45466,
    longitude: 30.5238
  };

  constructor(protected injector: Injector) {
    super(injector);
    this.locations = this.injector.get(Locations);
    this.cities = this.locations.getCity(Language.EN).map((city) => city.cityName);
    this.vincenty = this.injector.get(VincentySerivce);
  }

  isValid(address: Address): boolean {
    if (this.cities.includes(address.cityEn)) {
      return false;
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
  constructor(protected injector: Injector) {
    super(injector);
  }

  isValid(address: Address): boolean {
    return true;
  }
}

const validationStrategies: Record<number, (injector: Injector) => CityValidationStrategy> = {
  [ValidatorsRegion.KYIV]: (injector: Injector) => new KyivValidator(injector),
  [ValidatorsRegion.KYIV_REGION]: (injector: Injector) => new KyivRegionValidator(injector)
};

@Injectable({ providedIn: 'any' })
export class AddressValidator {
  constructor(private injector: Injector) {}

  isAvailable(locationId: number, address: Address): boolean {
    const strategy = validationStrategies[locationId];
    const validator = strategy(this.injector) || new DefaultCityValidator(this.injector);
    return validator.isValid(address);
  }
}
