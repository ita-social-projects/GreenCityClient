import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mainUbsLink } from 'src/app/main/links';
import { UserProfile } from '../../ubs-admin/models/ubs-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {
  constructor(private http: HttpClient) {}

  getDataClientProfile() {
    return this.http.get(`${mainUbsLink}/ubs/userProfile/user/getUserProfile`);
  }

  postDataClientProfile(user: UserProfile) {
    return this.http.post(`${mainUbsLink}/ubs/userProfile/user/update`, user);
  }
}
