import { Injectable } from '@angular/core';
import { mainUbsLink } from 'src/app/main/links';
import { HttpClient } from '@angular/common/http';
import { Bag, Service } from '../models/tariffs.interface';

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

  getCouriers() {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/getCouriers`);
  }

  activateLocation(id: number, languageCode) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/activeLocations/${id}?languageCode=${languageCode}`, languageCode);
  }

  deactivateLocation(id: number, languageCode) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/deactivateLocations/${id}?languageCode=${languageCode}`, languageCode);
  }

  editInfo(info) {
    return this.http.patch(`${mainUbsLink}/ubs/superAdmin/editInfoAboutTariff`, info);
  }
}
