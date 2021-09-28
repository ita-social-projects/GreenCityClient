import { Injectable } from '@angular/core';
import { mainUbsLink } from 'src/app/main/links';
import { HttpClient } from '@angular/common/http';
import { Services } from '../models/tariffs.interface';

@Injectable({
  providedIn: 'root'
})
export class TariffsService {
  constructor(private http: HttpClient) {}

  getAllTariffsService() {
    return this.http.get(`${mainUbsLink}/ubs/superAdmin/getTariffService`);
  }

  createNewService(services: Services) {
    return this.http.post(`${mainUbsLink}/ubs/superAdmin/createTariffService`, services);
  }
}
