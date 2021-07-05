import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bags } from '../models/ubs-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs';

  constructor(private http: HttpClient) {}

  public getBags(lang): Observable<Bags> {
    return this.http.get<Bags>(`${this.url}/order-details?lang=${lang}`);
  }
}
