import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  backend = 'assets/orders.json';

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get<any[]>(`${this.backend}`);
  }
}
