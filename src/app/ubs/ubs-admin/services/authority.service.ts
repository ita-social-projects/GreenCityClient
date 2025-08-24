import { Injectable } from '@angular/core';
import { mainUserLink } from '../../../main/links';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '@ubs/ubs-admin/models/employee-permissions.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  ownSecurityLink = `${mainUserLink}ownSecurity/`;

  constructor(private http: HttpClient) {}

  getAllAuthorities(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.ownSecurityLink}authorities/categories`);
  }
}
