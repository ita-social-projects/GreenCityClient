import { CertificateStatus } from '@ubs/ubs/enums/certificate-status.enum';
import { Address, AddressData, ICertificateResponse, LanguageResponseOptions } from './ubs.interface';
import { Language } from 'src/app/shared/i18n/Language';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { Subject } from 'rxjs';
import { Coordinates } from 'src/app/greencity/modules/user/models/edit-profile.model';

export class CCertificate {
  get code(): string {
    return this._code;
  }

  get points(): number {
    return this.isValid() ? this._points : 0;
  }

  get dateOfUse(): string {
    return this.certificateDateTreat(this._dateOfUse) ?? '';
  }

  get expirationDate(): string {
    return this.certificateDateTreat(this._expirationDate) ?? '';
  }

  constructor(
    private _code: string,
    private _certificateStatus: CertificateStatus,
    private _points: number,
    private _dateOfUse?: string | null,
    private _expirationDate?: string
  ) {}

  public static ofResponse(response: ICertificateResponse) {
    return new CCertificate(
      response.code,
      response.certificateStatus as CertificateStatus,
      response.points,
      response.dateOfUse,
      response.expirationDate
    );
  }

  public static ofError(code: string) {
    return new CCertificate(code, CertificateStatus.FAILED, 0);
  }

  public isValid(): boolean {
    return this.checkStatus(CertificateStatus.ACTIVE, CertificateStatus.NEW);
  }

  public isNotValid(): boolean {
    return this.checkStatus(CertificateStatus.EXPIRED, CertificateStatus.USED, CertificateStatus.FAILED);
  }

  public isUsed(): boolean {
    return this.checkStatus(CertificateStatus.USED);
  }

  public isExpired(): boolean {
    return this.checkStatus(CertificateStatus.EXPIRED);
  }

  public isFailed(): boolean {
    return this.checkStatus(CertificateStatus.FAILED);
  }

  private checkStatus(...statuses: CertificateStatus[]): boolean {
    return statuses.includes(this._certificateStatus);
  }

  private certificateDateTreat(date: string): string {
    return date?.split('-').reverse().join('.');
  }
}

export class CAddressData {
  private regionEn: string;
  private region: string;
  private city: string;
  private cityEn: string;
  private street: string;
  private streetEn: string;
  private districtEn: string;
  private district: string;
  private houseNumber: string;
  private entranceNumber: string;
  private houseCorpus: string;
  private placeId: string;
  private addressComment = '';
  private coordinates: google.maps.LatLngLiteral | Coordinates;

  private readonly placeIdChange: Subject<string> = new Subject();
  private readonly addressChange: Subject<AddressData> = new Subject();

  constructor(private readonly languageService: LanguageService) {}

  initAddressData(address: Address): void {
    this.region = address.regionUk;
    this.regionEn = address.regionEn;
    this.city = address.cityUk;
    this.cityEn = address.cityEn;
    this.street = address.streetUk;
    this.streetEn = address.streetEn;
    this.district = address.districtUk;
    this.districtEn = address.districtEn;
    this.houseNumber = address.houseNumber;
    this.entranceNumber = address.entranceNumber;
    this.houseCorpus = address.houseCorpus;
    this.placeId = address.placeId;
    this.coordinates = address.coordinates;
    this.addressComment = address.addressComment;
  }

  private isGoogleDefined(): boolean {
    return typeof window?.google?.maps === 'undefined';
  }

  setCoordinates(coordinates: google.maps.LatLngLiteral, opts?: { fetch: boolean }): void {
    if (this.isGoogleDefined()) {
      return;
    }

    this.coordinates = coordinates;
    if (!opts?.fetch) {
      return;
    }

    this.fetchAddress(coordinates);
  }

  getRegion(): string {
    return this.languageService.getCurrentLanguage() === Language.EN ? this.regionEn : this.region;
  }

  async setRegion(options: LanguageResponseOptions): Promise<void> {
    try {
      await this.setProperties('region', options, 'administrative_area_level_1');
    } catch (error) {
      console.error('Error during setting region:', error);
    }
  }

  setRegionWithTranslation(region: string, regionEn: string): void {
    this.region = region;
    this.regionEn = regionEn;
  }

  resetRegion(): void {
    this.region = '';
    this.regionEn = '';
  }

  getCity(): string {
    return this.languageService.getCurrentLanguage() === Language.EN ? this.cityEn : this.city;
  }

  async setCity(options: LanguageResponseOptions): Promise<void> {
    try {
      await this.setProperties('city', options, 'locality');
      await this.setRegion(options);
    } catch (error) {
      console.error('Error during setting city:', error);
    }
  }

  resetCity(): void {
    this.city = '';
    this.cityEn = '';
  }

  getStreet(): string {
    return this.languageService.getCurrentLanguage() === Language.EN ? this.streetEn : this.street;
  }

  async setStreet(options: LanguageResponseOptions): Promise<void> {
    try {
      this.placeId = options?.placeUk?.place_id || options?.placeEn?.place_id;
      await this.setProperties('street', options, 'route');
      await this.setDistrict(options);
    } catch (error) {
      console.error('Error during setting street:', error);
    }
  }

  resetStreet(): void {
    this.street = '';
    this.streetEn = '';
  }

  getDistrict(): string {
    return this.languageService.getLangValue(this.district, this.districtEn);
  }

  async setDistrict(options: LanguageResponseOptions): Promise<void> {
    try {
      this.resetDistrict();
      await this.setProperties('district', options, 'locality', 'sublocality', 'administrative_area_level_2');
    } catch (error) {
      console.error('Error during setting district:', error);
    }
  }

  setCustomDistrict(district: string, districtEn: string): void {
    this.district = district;
    this.districtEn = districtEn;
    this.addressChange.next(this.getValues());
  }

  setDistrictFromCity() {
    this.district = this.city;
    this.districtEn = this.cityEn;
    this.addressChange.next(this.getValues());
  }

  resetDistrict(): void {
    this.district = '';
    this.districtEn = '';
  }

  setHouseNumber(value: any) {
    this.houseNumber = value;
    this.addressChange.next(this.getValues());
  }

  resetHouseInfo() {
    this.houseNumber = '';
    this.houseCorpus = '';
    this.entranceNumber = '';
  }

  setHouseCorpus(value: any) {
    this.houseCorpus = value;
    this.addressChange.next(this.getValues());
  }

  setEntranceNumber(value: any) {
    this.entranceNumber = value;
    this.addressChange.next(this.getValues());
  }

  setAddressComment(comment: string) {
    this.addressComment = comment;
  }

  getPlaceIdChange(): Subject<string> {
    return this.placeIdChange;
  }

  getAddressChange(): Subject<AddressData> {
    return this.addressChange;
  }

  getValues(): AddressData {
    if (this.isGoogleDefined()) {
      return;
    }

    return {
      regionEn: this.regionEn,
      regionUk: this.region,
      cityUk: this.city,
      cityEn: this.cityEn,
      streetUk: this.street,
      streetEn: this.streetEn,
      districtEn: this.districtEn,
      districtUk: this.district,
      houseNumber: this.houseNumber,
      entranceNumber: this.entranceNumber,
      houseCorpus: this.houseCorpus,
      addressComment: this.addressComment,
      placeId: this.placeId,
      coordinates: this.coordinates
        ? /* eslint-disable */
          {
            latitude: 'lat' in this.coordinates ? this.coordinates?.lat : this.coordinates?.latitude,
            longitude: 'lng' in this.coordinates ? this.coordinates?.lng : this.coordinates?.longitude
          }
        : { latitude: 0, longitude: 0 }
      /* eslint-enable */
    };
  }

  isValid(): boolean {
    const data = this.getValues();
    delete data.addressComment;
    delete data.houseCorpus;
    delete data.entranceNumber;
    delete data.placeId;

    const values = Object.values(data);
    return values.every((value) => value);
  }

  async getPlaceIdByCoordinates(coordinates: google.maps.LatLngLiteral): Promise<string> {
    if (this.isGoogleDefined()) {
      return;
    }

    return new google.maps.Geocoder()
      .geocode({ location: coordinates })
      .then((response) => {
        const place_id = response.results[0]?.place_id;
        return place_id || '';
      })
      .catch((error) => {
        console.error('Geocoding failed:', error);
        return '';
      });
  }

  async getPlaceIdByAddress(): Promise<[placeId: string, types: string[]] | null> {
    if (this.isGoogleDefined()) {
      return;
    }

    const address = `${this.houseNumber} ${this.streetEn}, ${this.cityEn}, Ukraine`;

    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.length) {
          const location = results[0].geometry.location;
          this.coordinates = {
            latitude: location.lat(),
            longitude: location.lng()
          };
          this.placeId = results[0].place_id;
          resolve([results[0].place_id, results[0].types]);
        } else {
          console.error('Geocode was not successful:', status);
          resolve(null);
        }
      });
    });
  }

  //Tries to fetch address by selected coordinates
  private async fetchAddress(coordinates: google.maps.LatLngLiteral): Promise<void> {
    if (this.isGoogleDefined()) {
      return;
    }

    const geocoder = new google.maps.Geocoder();
    try {
      const responseUK = await geocoder.geocode({ location: coordinates, language: Language.UK });
      const responseEN = await geocoder.geocode({ location: coordinates, language: Language.EN });

      const placeUk = responseUK.results[0];
      const placeEn = responseEN.results[0];

      if (placeUk && placeEn) {
        await this.setCity({ placeUk, placeEn });
        await this.setStreet({ placeUk, placeEn });

        this.setHouseNumber(this.findValue(placeEn, 'street_number')?.long_name ?? '');

        this.placeId = placeEn?.place_id;
        this.placeIdChange.next(this.placeId);
      }
    } catch (error) {
      console.error('Error during address fetching:', error);
    }
  }

  //Translates values to achieve consistent view of address in different languages
  private async setProperties(propertyName: string, options: LanguageResponseOptions, ...googleLocalityType: string[]): Promise<void> {
    if (this.isGoogleDefined()) {
      return;
    }
    const { placeUk, placeEn } = options;

    try {
      placeUk && (await this.translateProperty(propertyName, placeUk, Language.UK, ...googleLocalityType));
      placeEn && (await this.translateProperty(propertyName + 'En', placeEn, Language.EN, ...googleLocalityType));
      this.addressChange.next(this.getValues());
    } catch (error) {
      console.error('Error during setting properties:', error);
    }
  }

  //Translates address component by placeId to required language
  private async translateProperty(propertyName: string, place: google.maps.GeocoderResult, ...googleLocalityType: string[]): Promise<void> {
    if (this.isGoogleDefined()) {
      return;
    }

    this[propertyName] = this.findValue(place, ...googleLocalityType)?.long_name ?? '';
  }

  //Find required address component in google response by it's type
  //For example 'route' is a street name, 'street_number' is a house number
  private findValue(response: google.maps.GeocoderResult, ...types: string[]): google.maps.GeocoderAddressComponent {
    for (const type of types) {
      const value = response.address_components.find((component) => component.types.some((t) => type === t));

      if (value) {
        return value;
      }
    }

    return null;
  }

  async getPlaceByPlaceId(placeId: string, language: string): Promise<google.maps.GeocoderResult> {
    if (this.isGoogleDefined()) {
      return;
    }

    const res = await new google.maps.Geocoder().geocode({ placeId, language });
    return res.results[0];
  }
}
