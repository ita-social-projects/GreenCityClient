import { Injectable } from '@angular/core';
import { mainUbsLink } from 'src/app/main/links';
import { HttpClient } from '@angular/common/http';
import { Bag } from '../models/tariffs.interface';

@Injectable({
  providedIn: 'root'
})
export class TariffsService {
  constructor(private http: HttpClient) {}

  getAllTariffsService() {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/getTariffService`);
  }

  createNewService(service: Bag) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/createTariffService`, service);
  }

  deleteService(id: number) {
    return this.http.delete(`${mainUbsLink}/ubs/superAdmin/deleteTariffService/${id}`);
  }

  editService(id: number, service: Bag) {
    return this.http.put(`${mainUbsLink}/ubs/superAdmin/editTariffService/${id}`, service);
  }
}
