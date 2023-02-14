import { Injectable } from '@angular/core';
import { mainUbsLink } from 'src/app/main/links';
import { HttpClient } from '@angular/common/http';
import { Bag, CreateCard, EditLocationName, Service, Couriers, Stations, Locations, DeactivateCard } from '../models/tariffs.interface';

import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Injectable({
  providedIn: 'root'
})
export class TariffsService {
  constructor(private http: HttpClient) {}

  courierId: number;
  locationId: number;
  allTariffServices: any;
  serviceId: number;

  setServiceId(id: number) {
    this.serviceId = id;
  }

  getServiceId() {
    return this.serviceId;
  }

  setCourierId(id: number) {
    this.courierId = id;
  }

  getCourierId() {
    return this.courierId;
  }

  setLocationId(id: number) {
    this.locationId = id;
  }

  getLocationId() {
    return this.locationId;
  }

  getAllTariffsForService(tariffId: number) {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/${tariffId}/getTariffService`);
  }

  createNewTariffForService(tariffService: Bag) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/createTariffService`, tariffService);
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

  createService(service: Service) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/createService`, service);
  }

  getService(tariffId) {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/${tariffId}/getService`);
  }

  editService(service: Service) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/editService`, service);
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

  setLimitDescription(description, courierId) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/setLimitDescription/${courierId}`, description);
  }

  setLimitsBySumOrder(info, tariffId) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/setLimitsBySumOfOrder/${tariffId}`, info);
  }

  setLimitsByAmountOfBags(info, tariffId) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/setLimitsByAmountOfBags/${tariffId}`, info);
  }

  includeBag(id: number) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/excludeLimit/${id}`, null);
  }

  excludeBag(id: number) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/includeLimit/${id}`, null);
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

  deactivate(deactivateCardObj: DeactivateCard): Observable<object> {
    const arr = [];
    const requestObj = {
      cities: `citiesId=${deactivateCardObj.cities}`,
      courier: `courierId=${deactivateCardObj.courier}`,
      regions: `regionsId=${deactivateCardObj.regions}`,
      stations: `stationsId=${deactivateCardObj.stations}`
    };

    Object.keys(deactivateCardObj).forEach((key) => {
      if (deactivateCardObj[key]) {
        arr.push(requestObj[key]);
      }
    });
    const query = `?${arr.join('&')}`;
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/deactivate${query}`, null);
  }

  deactivateTariffCard(tariffId: number): Observable<object> {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/deactivateTariff/${tariffId}`, null);
  }
}
