import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
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
  private readonly NAME = 'name';

  languageSubject: Subject<string> = new Subject<string>();
  firstNameBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getName());
  userIdBehaviourSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.getUserId());
  languageBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getCurrentLanguage());

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

  private getName(): string {
    return localStorage.getItem(this.NAME);
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

  public setFirstName(name: string): void {
    localStorage.setItem(this.NAME, name);
    this.firstNameBehaviourSubject.next(name);
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
    this.languageSubject.next(language);
  }

  public getCurrentLanguage(): Language {
    return localStorage.getItem('language') as Language;
  }

  public clear(): void {
    const currentLanguage: Language = this.getCurrentLanguage();
    localStorage.clear();
    this.setCurrentLanguage(currentLanguage);
    this.firstNameBehaviourSubject.next(null);
    this.userIdBehaviourSubject.next(null);
  }
}
