import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {mainLink} from '../links';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
   //protected apiUrl = 'https://greencitysoftserve.herokuapp.com/';
  protected apiUrl = mainLink;

  constructor(protected http: HttpClient) {}
}
