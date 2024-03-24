import { CertificateStatus } from 'src/app/ubs/ubs/certificate-status.enum';
import { Address, AddressData, DistrictsDtos, ICertificateResponse } from './ubs.interface';
import { GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { Language } from 'src/app/main/i18n/Language';
import { LanguageService } from 'src/app/main/i18n/language.service';

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

  constructor(private languageService: LanguageService) {}

  public initAddressData(address: Address): void {
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
    this.fetchPlaceId();
  }

  public getRegion(language: Language): string {
    return language === Language.EN ? this.regionEn : this.region;
  }

  public setRegion(region: GooglePrediction): void {
    this.setProperties('region', region);
    this.resetPlaceId();
  }

  public setRegionWithTranslation(region: string, regionEn: string): void {
    this.region = region;
    this.regionEn = regionEn;
    this.resetPlaceId();
  }

  public resetRegion(): void {
    this.region = '';
    this.regionEn = '';
    this.resetPlaceId();
  }

  public getCity(language: Language): string {
    return language === Language.EN ? this.cityEn : this.city;
  }

  public setCity(city: GooglePrediction): void {
    this.setProperties('city', city);
    this.resetPlaceId();
  }

  public resetCity(): void {
    this.city = '';
    this.cityEn = '';
    this.resetPlaceId();
  }

  public getStreet(): string {
    return this.languageService.getCurrentLanguage() === Language.EN ? this.streetEn : this.street;
  }

  public setStreet(street: GooglePrediction): void {
    this.setProperties('street', street);
    this.resetPlaceId();
  }

  public resetStreet(): void {
    this.street = '';
    this.streetEn = '';
    this.resetPlaceId();
  }

  public getDistrict(): DistrictsDtos | null {
    return this.district && this.districtEn ? { nameUa: this.district, nameEn: this.districtEn } : null;
  }

  public setDistrict(district: DistrictsDtos): void {
    this.district = district?.nameUa ?? '';
    this.districtEn = district?.nameEn ?? '';
  }

  public resetDistrict(): void {
    this.district = '';
    this.districtEn = '';
  }

  public setHouseNumber(value: any) {
    this.houseNumber = value;
    this.resetPlaceId();

    if (value) {
      this.fetchPlaceId();
    }
  }

  public setHouseCorpus(value: any) {
    this.houseCorpus = value;
  }

  public setEntranceNumber(value: any) {
    this.entranceNumber = value;
  }

  public setAddressComment(comment: string) {
    this.addressComment = comment;
  }

  private resetPlaceId() {
    this.placeId = '';
  }

  public getValues(): AddressData {
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

  public isValid(): boolean {
    let data = this.getValues();
    delete data.addressComment;
    delete data.houseCorpus;
    delete data.entranceNumber;

    const values = Object.values(data);
    return values.every((value) => value);
  }

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
      } else if (isUseHouseNumber) {
        this.fetchPlaceId(false);
      }
    });
  }

  private getSearchAddress(isExactAddress = true): string {
    const houseNumber = isExactAddress ? `${this.houseNumber}, ` : '';
    const street = isExactAddress ? `${this.street}, ` : '';
    return this.languageService.getCurrentLanguage() === Language.EN
      ? `${street}${houseNumber}${this.cityEn}, Ukarine`
      : `${street}${houseNumber}${this.city}, Україна`;
  }

  private setProperties(propertyName: string, prediction: GooglePrediction): void {
    this.languageService.getCurrentLanguage() === Language.EN
      ? this.setPropertyEn(propertyName, prediction)
      : this.setPropertyUk(propertyName, prediction);
  }

  private setPropertyEn(propertyName: string, prediction: GooglePrediction): void {
    this.translateProperty(propertyName, prediction.place_id, Language.UK);
    this[propertyName + 'En'] = prediction.structured_formatting.main_text;
  }

  private setPropertyUk(propertyName: string, prediction: GooglePrediction): void {
    this[propertyName] = prediction.structured_formatting.main_text;
    this.translateProperty(propertyName + 'En', prediction.place_id, Language.EN);
  }

  private translateProperty(propertyName: string, placeId: string, language: Language): void {
    new google.maps.Geocoder().geocode({ placeId, language }).then((response) => {
      this[propertyName] = response.results[0].address_components[0].long_name;
    });
  }
}
