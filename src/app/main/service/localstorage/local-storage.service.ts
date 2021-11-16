import { Language } from '../../i18n/Language';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FilterModel } from '@eco-news-models/create-news-interface';

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
  accessTokenBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getAccessToken());
  ubsRegBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getUbsRegistration());

  public getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  public getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  public getUserId(): number {
    return Number.parseInt(localStorage.getItem(this.USER_ID), 10);
  }

  private getName(): string {
    return localStorage.getItem(this.NAME);
  }

  public setAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
    this.removeUbsRegistration();
    this.accessTokenBehaviourSubject.next(accessToken);
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
    this.languageBehaviourSubject.next(language);
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

  public setTagsOfNews(key: string, tags: FilterModel[]) {
    localStorage.setItem(key, JSON.stringify(tags));
  }

  public getTagsOfNews(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public removeTagsOfNews(key: string) {
    localStorage.removeItem(key);
  }

  public setUbsRegistration(value: boolean): void {
    if (!localStorage.getItem(this.USER_ID)) {
      this.ubsRegBehaviourSubject.next(value);
      localStorage.setItem('callUbsRegWindow', `${value}`);
    }
  }

  public getUbsRegistration(): boolean {
    return !!localStorage.getItem('callUbsRegWindow');
  }

  public removeUbsRegistration(): void {
    localStorage.removeItem('callUbsRegWindow');
  }

  public setUbsOrderData(personalData: string, orderData: string) {
    localStorage.setItem('UBSpersonalData', personalData);
    localStorage.setItem('UBSorderData', orderData);
  }

  public setLocationId(currentLocationId: number) {
    localStorage.setItem('currentLocationId', JSON.stringify(currentLocationId));
  }

  public setLocations(locations: any) {
    localStorage.setItem('locations', JSON.stringify(locations));
  }

  public setUbsOrderId(orderId: string) {
    localStorage.setItem('UbsOrderId', JSON.stringify(orderId));
  }

  public getUbsOrderId(): any {
    return localStorage.getItem('UbsOrderId') === 'undefined' ? false : JSON.parse(localStorage.getItem('UbsOrderId'));
  }

  public removeUbsOrderId() {
    localStorage.removeItem('UbsOrderId');
  }

  public removeUbsOrderData() {
    localStorage.removeItem('UBSpersonalData');
    localStorage.removeItem('UBSorderData');
    localStorage.removeItem('currentLocationId');
    localStorage.removeItem('locations');
  }

  public getUbsPersonalData(): any {
    return localStorage.getItem('UBSpersonalData') === 'undefined' ? false : JSON.parse(localStorage.getItem('UBSpersonalData'));
  }

  public getUbsOrderData(): any {
    return localStorage.getItem('UBSorderData') === 'undefined' ? false : JSON.parse(localStorage.getItem('UBSorderData'));
  }

  public getLocationId(): any {
    return localStorage.getItem('currentLocationId') === null ? false : JSON.parse(localStorage.getItem('currentLocationId'));
  }

  public getLocations(): any {
    return JSON.parse(localStorage.getItem('locations'));
  }

  public setCustomer(customer) {
    return localStorage.setItem('currentCustomer', JSON.stringify(customer));
  }

  public getCustomer() {
    return JSON.parse(localStorage.getItem('currentCustomer'));
  }

  public removeCurrentCustomer(): void {
    localStorage.removeItem('currentCustomer');
  }
}
