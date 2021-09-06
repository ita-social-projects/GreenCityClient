import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.url}/order-details`);
  }
}
