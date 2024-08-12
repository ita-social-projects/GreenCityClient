import { CertificateStatus } from 'src/app/ubs/ubs/certificate-status.enum';
import { Address, AddressData, DistrictsDtos, ICertificateResponse } from './ubs.interface';
import { Language } from 'src/app/main/i18n/Language';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Subject } from 'rxjs';

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
  private coordinates: google.maps.LatLng;

  private placeIdChange: Subject<string> = new Subject();
  private addressChange: Subject<AddressData> = new Subject();

  constructor(private languageService: LanguageService) {}

  initAddressData(address: Address): void {
    this.region = address.region;
    this.regionEn = address.regionEn;
    this.city = address.city;
    this.cityEn = address.cityEn;
    this.street = address.street;
    this.streetEn = address.streetEn;
    this.district = address.district;
    this.districtEn = address.districtEn;
    this.houseNumber = address.houseNumber;
    this.entranceNumber = address.entranceNumber;
    this.houseCorpus = address.houseCorpus;
    this.placeId = address.placeId;
    this.addressComment = address.addressComment;
  }

  setCoordinates(coordinates: google.maps.LatLng): void {
    this.coordinates = coordinates;

    this.fetchAddress(coordinates);
  }

  getRegion(language: Language): string {
    return language === Language.EN ? this.regionEn : this.region;
  }

  setRegion(place_id: string): void {
    this.setProperties('region', place_id, 'administrative_area_level_1');
    this.resetPlaceId();
  }

  setRegionWithTranslation(region: string, regionEn: string): void {
    this.region = region;
    this.regionEn = regionEn;
    this.resetPlaceId();
  }

  resetRegion(): void {
    this.region = '';
    this.regionEn = '';
    this.resetPlaceId();
  }

  getCity(language: Language): string {
    return language === Language.EN ? this.cityEn : this.city;
  }

  setCity(place_id: string): void {
    this.setProperties('city', place_id, 'locality');
    this.resetPlaceId();
  }

  resetCity(): void {
    this.city = '';
    this.cityEn = '';
    this.resetPlaceId();
  }

  getStreet(): string {
    return this.languageService.getCurrentLanguage() === Language.EN ? this.streetEn : this.street;
  }

  setStreet(place_id: string): void {
    this.setProperties('street', place_id, 'route');
    this.setDistrict(place_id);
    this.resetPlaceId();
  }

  resetStreet(): void {
    this.street = '';
    this.streetEn = '';
    this.resetPlaceId();
  }

  getDistrict(): DistrictsDtos | null {
    return this.district && this.districtEn ? { nameUa: this.district, nameEn: this.districtEn } : null;
  }

  setDistrict(place_id: string): void {
    this.resetDistrict();

    this.setProperties('district', place_id, 'sublocality', 'administrative_area_level_2');
  }

  resetDistrict(): void {
    this.district = '';
    this.districtEn = '';
  }

  setHouseNumber(value: any) {
    this.houseNumber = value;
    this.resetPlaceId();

    if (value) {
      this.fetchPlaceId();
    }
  }

  setHouseCorpus(value: any) {
    this.houseCorpus = value;
  }

  setEntranceNumber(value: any) {
    this.entranceNumber = value;
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
    const addressData: AddressData = {
      searchAddress: this.getSearchAddress(),
      regionEn: this.regionEn,
      region: this.region,
      city: this.city,
      cityEn: this.cityEn,
      street: this.street,
      streetEn: this.streetEn,
      districtEn: this.districtEn,
      district: this.district,
      houseNumber: this.houseNumber,
      entranceNumber: this.entranceNumber,
      houseCorpus: this.houseCorpus,
      addressComment: this.addressComment,
      placeId: this.placeId
    };
    return addressData;
  }

  isValid(): boolean {
    const data = this.getValues();
    delete data.addressComment;
    delete data.houseCorpus;
    delete data.entranceNumber;

    const values = Object.values(data);
    return values.every((value) => value);
  }

  private resetPlaceId() {
    this.placeId = '';
    this.placeIdChange.next(this.placeId);
  }

  //Tries to fetch address by selected coordinates
  private fetchAddress(coordinates: google.maps.LatLng) {
    new google.maps.Geocoder().geocode({ location: coordinates }).then((response) => {
      const place_id = response.results[0]?.place_id;
      if (place_id) {
        this.setRegion(place_id);
        this.setCity(place_id);
        this.setStreet(place_id);

        this.setHouseNumber(this.findValue(response.results[0], 'street_number')?.long_name ?? '');
        this.placeId = place_id;
        this.placeIdChange.next(this.placeId);
      }
    });
  }

  //Fetch placeId for address
  //If it cant find exact address it tries to find address without house number
  private fetchPlaceId(isUseHouseNumber = true): void {
    const request = {
      input: this.getSearchAddress(isUseHouseNumber),
      language: this.languageService.getCurrentLanguage() === Language.EN ? 'en' : 'uk',
      types: ['address'],
      componentRestrictions: { country: 'ua' }
    };

    new google.maps.places.AutocompleteService().getPlacePredictions(request, (predictions) => {
      if (predictions?.length && predictions[0]?.place_id) {
        this.placeId = predictions[0]?.place_id;
        this.placeIdChange.next(this.placeId);
      } else if (isUseHouseNumber) {
        this.fetchPlaceId(false);
      }
    });
  }

  private getSearchAddress(isExactAddress = true): string {
    const houseNumber = isExactAddress && this.houseNumber ? `${this.houseNumber}, ` : '';
    const street = isExactAddress ? `${this.languageService.getLangValue(this.street, this.streetEn)} ` : '';

    return this.languageService.getCurrentLanguage() === Language.EN
      ? `${this.regionEn}, ${this.cityEn} city, ${street}${houseNumber}, Ukraine`
      : `${this.region}, місто ${this.city}, ${street}${houseNumber}, Україна`;
  }

  //Translates values to achieve consistent view of address in different languages
  private setProperties(propertyName: string, place_id: string, ...googleLocalityType: string[]): void {
    this.translateProperty(propertyName, place_id, Language.UK, ...googleLocalityType);
    this.translateProperty(propertyName + 'En', place_id, Language.EN, ...googleLocalityType);
  }

  //Translates address component by placeId to required language
  private translateProperty(propertyName: string, placeId: string, language: Language, ...googleLocalityType: string[]): void {
    new google.maps.Geocoder().geocode({ placeId, language }).then((response) => {
      this[propertyName] = this.findValue(response.results[0], ...googleLocalityType)?.long_name ?? '';

      if (googleLocalityType.includes('route')) {
        console.warn('route', this[propertyName], response.results[0]);
      }

      this.addressChange.next(this.getValues());
    });
  }

  //Find required address component in google response by it's type
  //For example 'route' is a street name, 'street_number' is a house number
  private findValue(response: google.maps.GeocoderResult, ...type: string[]): google.maps.GeocoderAddressComponent {
    return response.address_components.find((component) => component.types.some((t) => type.includes(t)));
  }
}
