import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserRole} from '../../model/user/user-role.model';
import {Observable} from 'rxjs';
import {mailLink} from '../../links';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userRole: UserRole;

  constructor(private http: HttpClient) { }

  getUserRole(): Observable<string> {
    return this.http.get<string>(mailLink + 'user/role', httpOptions);
  }
}
