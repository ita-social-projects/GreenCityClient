import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UbsFormService {
  constructor(private http: HttpClient) { }

  getPersonalData(): Observable<any> {
    return this.http.get('https://greencity-ubs.azurewebsites.net/ubs/second');
  }
}
