import { Injectable } from '@angular/core';

/**
 * @author Yurii Koval
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly ACCESS_TOKEN = 'accessToken';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private readonly USER_ID = 'userId';
  private readonly FIRST_NAME = 'firstName';

  constructor() {}

  public getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  public getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  public getUserId(): number {
    return Number.parseInt(localStorage.getItem(this.USER_ID), 10);
  }

  public getFirsName(): string {
    return localStorage.getItem(this.FIRST_NAME);
  }

  public setAccessToken(refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, refreshToken);
  }

  public setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  public setFirstName(firstName: string): void {
    localStorage.setItem(this.FIRST_NAME, firstName);
  }
}
