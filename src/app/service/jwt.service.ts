import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor() {

  }

  public isTokenValid(token: string): boolean {
    if (token != null) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      let dateInSecond = (new Date("2015/04/29 11:24:00").getTime() / 1000);
      return dateInSecond < decodedJwtData.exp;
    } else {
      return false;
    }


  }

  public getAccessToken(): string {
    return localStorage.getItem("accessToken");
  }

  public getRefreshToken(): string {
    return localStorage.getItem("refreshToken");
  }

  public saveAccessToken(accessToken: string) {
    if (accessToken != null) {
      localStorage.setItem("accessToken", accessToken);
    }
  }

  public saveRefreshToken(refreshToken: string) {
    if (refreshToken != null) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }
}
