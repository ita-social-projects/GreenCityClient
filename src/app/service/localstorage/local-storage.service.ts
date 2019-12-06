import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  firstNameBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getFirsName());

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

  public setUserId(userId: number): void {
    localStorage.setItem(this.USER_ID, String(userId));
  }

  public setFirstName(firstName: string): void {
    this.firstNameBehaviourSubject.next(firstName);
    localStorage.setItem(this.FIRST_NAME, firstName);
  }

  public clear(): void {
    localStorage.clear();
    this.firstNameBehaviourSubject.next(null);
  }
}
