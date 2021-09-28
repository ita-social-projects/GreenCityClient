import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserOrdersService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs/client';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  getAllUserOrders(): Observable<any> {
    const lang = localStorage.getItem('language') === 'ua' ? 1 : 2;
    return this.http.get<any[]>(`${this.url}/get-all-orders-data/${lang}`);
  }
}
