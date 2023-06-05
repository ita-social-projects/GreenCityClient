import { Injectable } from '@angular/core';
import { mainUbsLink } from 'src/app/main/links';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Bag, CreateCard, EditLocationName, Service, Couriers, Stations, Locations, DeactivateCard } from '../models/tariffs.interface';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { TariffPlaceholderSelected } from '../components/ubs-admin-tariffs/ubs-tariffs.enum';

@Injectable({
  providedIn: 'root'
})
export class TariffsService {
  constructor(private http: HttpClient, private langService: LanguageService) {}

  getAllTariffsForService(tariffId: number) {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/${tariffId}/getTariffService`);
  }

  createNewTariffForService(tariffService: Bag, tariffId: number) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/${tariffId}/createTariffService`, tariffService);
  }

  deleteTariffForService(id: number) {
    return this.http.delete(`${mainUbsLink}/ubs/superAdmin/deleteTariffService/${id}`);
  }

  deleteService(id: number) {
    return this.http.delete(`${mainUbsLink}/ubs/superAdmin/deleteService/${id}`);
  }

  editTariffForService(id: number, body: Bag) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/editTariffService/${id}`, body);
  }

  createService(service: Service, tariffId: number) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/${tariffId}/createService`, service);
  }

  getService(tariffId) {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/${tariffId}/getService`);
  }

  getTariffLimits(tariffId) {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/getTariffLimits/${tariffId}`);
  }

  editService(service: Service, id: number) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/editService/${id}`, service);
  }

  getLocations(): Observable<Locations[]> {
    return this.http.get<Locations[]>(`${mainUbsLink}/ubs/superAdmin/getLocations`);
  }

  getActiveLocations(): Observable<Locations[]> {
    return this.http.get<Locations[]>(`${mainUbsLink}/ubs/superAdmin/getActiveLocations`);
  }

  getCouriers(): Observable<Couriers[]> {
    return this.http.get<Couriers[]>(`${mainUbsLink}/ubs/superAdmin/getCouriers`);
  }

  editInfo(info) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/editInfoAboutTariff`, info);
  }

  setTariffLimits(limits, tariffId: number) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/setTariffLimits/${tariffId}`, limits);
  }
  public getJSON(sourceText, lang, translateTo): Observable<any> {
    return ajax.getJSON(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${lang}&tl=${translateTo}&dt=t&q=` + encodeURI(sourceText)
    );
  }

  addLocation(card) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/addLocations`, card);
  }

  getAllStations(): Observable<Stations[]> {
    return this.http.get<Stations[]>(`${mainUbsLink}/ubs/superAdmin/get-all-receiving-station`);
  }

  addStation(nameOfStation) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/create-receiving-station?name=${nameOfStation}`, nameOfStation);
  }

  addCourier(nameOfCourier) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/createCourier`, nameOfCourier);
  }

  editStation(newStation) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/update-receiving-station`, newStation);
  }

  editCourier(newCourier) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/update-courier`, newCourier);
  }

  public editLocationName(newLocation: EditLocationName[]): Observable<object> {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/locations/edit`, newLocation);
  }

  public getFilteredCard(filterData): Observable<any[]> {
    return this.http.get<any[]>(`${mainUbsLink}/ubs/superAdmin/tariffs`, { params: filterData });
  }

  public getCardInfo(): Observable<any[]> {
    return this.http.get<any[]>(`${mainUbsLink}/ubs/superAdmin/tariffs`);
  }

  public createCard(card: CreateCard): Observable<object> {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/add-new-tariff`, card);
  }

  public checkIfCardExist(card: CreateCard): Observable<object> {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/check-if-tariff-exists`, card);
  }

  public editTariffInfo(body, tariffId) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/editTariffInfo/${tariffId}`, body);
  }

  deactivate(deactivateCardObj: DeactivateCard, status: string): Observable<object> {
    const arr = [];
    const requestObj = {
      cities: `citiesIds=${deactivateCardObj.cities}`,
      courier: `courierId=${deactivateCardObj.courier}`,
      regions: `regionsIds=${deactivateCardObj.regions}`,
      stations: `stationsIds=${deactivateCardObj.stations}`
    };

    Object.keys(deactivateCardObj).forEach((key) => {
      if (deactivateCardObj[key]) {
        arr.push(requestObj[key]);
      }
    });
    const query = `?${arr.join('&')}`;

    return this.http.post(`${mainUbsLink}/ubs/superAdmin/deactivate${query}&status=${status}`, null);
  }

  switchTariffStatus(tariffId: number, status): Observable<object> {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/switchTariffStatus/${tariffId}?status=${status}`, null);
  }

  setDate(language): string {
    return new DatePipe(language).transform(new Date(), 'MMM dd, yyyy');
  }

  getPlaceholderValue(selectedItem, translated = false): string {
    let selected;
    if (translated) {
      selected = this.langService.getLangValue(TariffPlaceholderSelected.en, TariffPlaceholderSelected.ua);
    } else {
      selected = this.langService.getLangValue(TariffPlaceholderSelected.ua, TariffPlaceholderSelected.en);
    }
    return `${selectedItem} ${selected}`;
  }
}
