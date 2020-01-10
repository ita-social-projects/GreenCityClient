import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Language} from '../../i18n/Language';

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

  firstNameBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getFirstName());
  userIdBehaviourSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.getUserId());

  constructor() {
  }

  public getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  public getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private getUserId(): number {
    return Number.parseInt(localStorage.getItem(this.USER_ID), 10);
  }

  private getFirstName(): string {
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
    this.userIdBehaviourSubject.next(this.getUserId());
  }

  public setFirstName(firstName: string): void {
    localStorage.setItem(this.FIRST_NAME, firstName);
    this.firstNameBehaviourSubject.next(firstName);
  }

  public setFirstSignIn(): void {
    localStorage.setItem('firstSignIn', 'true');
  }

  public unsetFirstSignIn(): void {
    localStorage.setItem('firstSignIn', 'false');
  }

  public getFirstSighIn(): boolean {
    return localStorage.getItem('firstSignIn') === 'true';
  }

  public setCurrentLanguage(language: Language) {
    localStorage.setItem('language', language);
  }

  public getCurrentLanguage(): Language {
    return localStorage.getItem('language') as Language;
  }

  public clear(): void {
    localStorage.clear();
    this.firstNameBehaviourSubject.next(null);
    this.userIdBehaviourSubject.next(null);
  }
}
