import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected apiUrl = 'http://localhost:8080';
  constructor(protected http: HttpClient) {}
}
