import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() {
  }

  public isExpired(token: string): boolean {
    if (token != null) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      const dateInSecond = (new Date().getTime() / 1000);
      return dateInSecond > decodedJwtData.exp;
    } else {
      return false;
    }
  }

  public getAccessToken(): string {
    return localStorage.getItem('accessToken');
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refreshToken');
  }

  public saveAccessToken(accessToken: string) {
    if (accessToken != null) {
      localStorage.setItem('accessToken', accessToken);
    }
  }

  public saveRefreshToken(refreshToken: string) {
    if (refreshToken != null) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  public getEmailFromAccessToken(): string {
    const accessToken = this.getAccessToken();
    if (accessToken == null) {
      return null;
    }
    const jwtData = accessToken.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData.sub;
  }

  public setFirstName(firstName: string) {
    if (firstName != null) {
      localStorage.setItem('firstName', firstName);
    }
  }
}
