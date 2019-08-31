import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserRole} from '../../model/user/user-role.model';
import {Observable} from 'rxjs';
import {mailLink} from '../../links';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userRole: UserRole;

  constructor(private http: HttpClient) { }

  getUserRole(): Observable<UserRole> {
    console.log(mailLink + 'user/role');
    return  this.http.get<UserRole>(mailLink + 'user/role', httpOptions);
  }
}
