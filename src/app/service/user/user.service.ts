import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mailLink} from '../../links';

const jwtData = localStorage.getItem('accessToken').split('.')[1];
const decodedJwtJsonData = window.atob(jwtData);
const decodedJwtData = JSON.parse(decodedJwtJsonData);

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getUserRole(): string {
    return  decodedJwtData.roles[0];
  }
}
