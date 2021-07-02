import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { changePasswordLink, mainUbsLink } from 'src/app/main/links';

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  getDataClientProfile(user) {
    return this.http.get(user);
  }

  postDataClientProfile(user) {
    return this.http.post(`${mainUbsLink}/ubs/userProfile/user/save`, user);
  }

  changePassword(passwordData) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.localStorageService.getAccessToken()
      })
    };
    return this.http.put(changePasswordLink, passwordData, httpOptions);
  }
}
