import { Injectable } from '@angular/core';
import { mainUbsLink } from 'src/app/main/links';
import { HttpClient } from '@angular/common/http';
import { Bag, Service } from '../models/tariffs.interface';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Injectable({
  providedIn: 'root'
})
export class TariffsService {
  constructor(private http: HttpClient) {}

  getAllTariffsForService() {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/getTariffService`);
  }

  createNewTariffForService(tariffService: Bag) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/createTariffService`, tariffService);
  }

  deleteTariffForService(id: number) {
    return this.http.delete(`${mainUbsLink}/ubs/superAdmin/deleteTariffService/${id}`);
  }

  editTariffForService(id: number, tariffService: Bag) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/editTariffService/${id}`, tariffService);
  }

  createService(service: Service) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/createService`, service);
  }

  getAllServices() {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/getService`);
  }

  deleteService(id: number) {
    return this.http.delete(`${mainUbsLink}/ubs/superAdmin/deleteService/${id}`);
  }

  editService(id: number, service: Service) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/editService/${id}`, service);
  }

  getLocations() {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/getLocations`);
  }

  getCouriers(): Observable<any[]> {
    return this.http.get<any[]>(`${mainUbsLink}/ubs/superAdmin/getCouriers`);
  }

  editInfo(info) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/editInfoAboutTariff`, info);
  }

  public getJSON(sourceText): Observable<any> {
    return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=en&dt=t&q=' + encodeURI(sourceText));
  }

  addLocation(card) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/addLocations`, card);
  }

  getAllStations(): Observable<any[]> {
    return this.http.get<any[]>(`${mainUbsLink}/ubs/superAdmin/get-all-receiving-station`);
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

  editLocation(newLocation) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/update-location`, newLocation);
  }
}
