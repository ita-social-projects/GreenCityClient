import { Language } from '../../i18n/Language';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventPageResponceDto } from '../../component/events/models/events.interface';
import { HabitInterface } from '@global-user/components/habit/models/interfaces/habit.interface';
import { CourierLocations, Address } from 'src/app/ubs/ubs/models/ubs.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly ACCESS_TOKEN = 'accessToken';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private readonly USER_ID = 'userId';
  private readonly NAME = 'name';
  private readonly PREVIOUS_PAGE = 'previousPage';
  private readonly CAN_USER_EDIT_EVENT = 'canUserEdit';
  private readonly EDIT_EVENT = 'editEvent';
  private readonly EDIT_HABIT = 'editHabit';
  private readonly ORDER_TO_REDIRECT = 'orderIdToRedirect';
  private readonly HABITS_GALLERY_VIEW = 'habitsGalleryView';

  languageSubject: Subject<string> = new Subject<string>();
  firstNameBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getName());
  userIdBehaviourSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.getUserId());
  languageBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getCurrentLanguage());
  accessTokenBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.getAccessToken());
  ubsRegBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getUbsRegistration());
  ubsRedirectionBehaviourSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.getOrderIdToRedirect());

  public setHabitsGalleryView(value: boolean): void {
    localStorage.setItem(this.HABITS_GALLERY_VIEW, JSON.stringify(value));
  }

  public getHabitsGalleryView(): boolean | null {
    return JSON.parse(localStorage.getItem(this.HABITS_GALLERY_VIEW));
  }

  public setHabitForEdit(key: string, habit: HabitInterface) {
    localStorage.setItem(key, JSON.stringify(habit));
  }

  public getHabitForEdit() {
    return JSON.parse(localStorage.getItem(this.EDIT_HABIT));
  }

  public getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  public setEditMode(key: string, permision: boolean) {
    localStorage.setItem(key, `${permision}`);
  }

  public getEditMode(): boolean {
    return localStorage.getItem(this.CAN_USER_EDIT_EVENT) === 'true';
  }

  public setEventForEdit(key: string, event: EventPageResponceDto) {
    localStorage.setItem(key, JSON.stringify(event));
  }

  public getEventForEdit() {
    return JSON.parse(localStorage.getItem(this.EDIT_EVENT));
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

  public getPreviousPage(): string {
    return localStorage.getItem(this.PREVIOUS_PAGE);
  }

  public setCurentPage(key: string, pageName: string) {
    localStorage.setItem(key, pageName);
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

  public setUbsRegistration(value: boolean): void {
    if (!localStorage.getItem(this.USER_ID)) {
      this.ubsRegBehaviourSubject.next(value);
      localStorage.setItem('callUbsRegWindow', `${value}`);
    }
  }

  public getUbsRegistration(): boolean {
    return localStorage.getItem('callUbsRegWindow') === 'true';
  }

  public removeUbsRegistration(): void {
    localStorage.removeItem('callUbsRegWindow');
  }

  public setUbsOrderData(personalData: string, orderData: string) {
    localStorage.setItem('UBSpersonalData', personalData);
    localStorage.setItem('UBSorderData', orderData);
  }

  public setUbsOrderDataBeforeRedirect(personalData: string, orderData: string, anotherClientData: string, UBSExistingOrderId: string) {
    localStorage.setItem('UBSpersonalData', personalData);
    localStorage.setItem('UBSorderData', orderData);
    localStorage.setItem('anotherClient', anotherClientData);
    localStorage.setItem('UBSExistingOrderId', UBSExistingOrderId);
  }

  public removeanotherClientData(): void {
    localStorage.removeItem('anotherClient');
  }

  public setLocationId(currentLocationId: number) {
    localStorage.setItem('currentLocationId', String(currentLocationId));
  }

  public setLocations(locations: any) {
    localStorage.setItem('locations', JSON.stringify(locations));
  }

  public setOrderWithoutPayment(value: boolean): void {
    localStorage.setItem('saveOrderWithoutPayment', String(value));
  }

  public getOrderWithoutPayment(): any {
    return localStorage.getItem('saveOrderWithoutPayment') === 'undefined'
      ? false
      : JSON.parse(localStorage.getItem('saveOrderWithoutPayment'));
  }

  public setUbsOrderId(orderId: string | number): void {
    localStorage.setItem('UbsOrderId', String(orderId));
  }

  public getUbsOrderId(): any {
    return localStorage.getItem('UbsOrderId') === 'undefined' ? false : JSON.parse(localStorage.getItem('UbsOrderId'));
  }

  public removeUbsOrderId() {
    localStorage.removeItem('UbsOrderId');
  }

  public setUbsFondyOrderId(orderId: string | number) {
    localStorage.setItem('UbsFondyOrderId', String(orderId));
  }

  public setUbsBonusesOrderId(orderId: string | number) {
    localStorage.setItem('UbsBonusesOrderId', String(orderId));
  }

  public getUbsBonusesOrderId(): any {
    return localStorage.getItem('UbsBonusesOrderId') === 'undefined' ? false : JSON.parse(localStorage.getItem('UbsBonusesOrderId'));
  }

  public getUbsFondyOrderId(): any {
    return localStorage.getItem('UbsFondyOrderId') === 'undefined' ? false : JSON.parse(localStorage.getItem('UbsFondyOrderId'));
  }

  public removeUbsFondyOrderId() {
    localStorage.removeItem('UbsFondyOrderId');
  }

  public removeOrderWithoutPayment(): void {
    localStorage.removeItem('saveOrderWithoutPayment');
  }

  public removeUBSExistingOrderId() {
    localStorage.removeItem('UBSExistingOrderId');
  }

  public setUserPagePayment(state: boolean): unknown {
    return localStorage.setItem('IsUserPagePayment', String(state));
  }

  public getUserPagePayment(): string {
    return localStorage.getItem('IsUserPagePayment');
  }

  public removeUserPagePayment(): void {
    localStorage.removeItem('IsUserPagePayment');
  }

  public clearPaymentInfo(): void {
    this.removeUbsFondyOrderId();
    this.removeUserPagePayment();
  }

  public removeUbsOrderData() {
    localStorage.removeItem('UBSpersonalData');
    localStorage.removeItem('UBSorderData');
    localStorage.removeItem('currentLocationId');
    localStorage.removeItem('locations');
    localStorage.removeItem('addressId');
    localStorage.removeItem('anotherClient');
  }

  public removeUbsOrderAndPersonalData(): void {
    localStorage.removeItem('UBSpersonalData');
    localStorage.removeItem('UBSorderData');
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

  public getExistingOrderId(): string {
    return localStorage.getItem('UBSExistingOrderId');
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

  public setOrderIdToRedirect(orderId: number): void {
    localStorage.setItem(this.ORDER_TO_REDIRECT, String(orderId));
    this.ubsRedirectionBehaviourSubject.next(orderId);
  }

  public getOrderIdToRedirect(): number {
    return Number.parseInt(localStorage.getItem(this.ORDER_TO_REDIRECT), 10);
  }

  public setUbsAdminOrdersTableTitleColumnFilter(filters): void {
    if (filters.length) {
      const serialized = JSON.stringify(filters);
      window.localStorage.setItem('UbsAdminOrdersTableTitleColumnFilters', serialized);
    } else {
      window.localStorage.removeItem('UbsAdminOrdersTableTitleColumnFilters');
    }
  }

  public getUbsAdminOrdersTableTitleColumnFilter() {
    const parsed = JSON.parse(window.localStorage.getItem('UbsAdminOrdersTableTitleColumnFilters')) || [];
    return parsed;
  }

  public removeAdminOrderFilters(): void {
    window.localStorage.removeItem('UbsAdminOrdersTableTitleColumnFilters');
  }

  public setAdminOrdersDateFilter(filters): void {
    if (filters) {
      const serialized = JSON.stringify(filters);
      window.localStorage.setItem('UbsAdminOrdersDateFilters', serialized);
    }
  }

  public getAdminOrdersDateFilter() {
    const parsed = JSON.parse(window.localStorage.getItem('UbsAdminOrdersDateFilters'));
    return parsed;
  }

  public removeAdminOrderDateFilters(): void {
    window.localStorage.removeItem('UbsAdminOrdersDateFilters');
  }

  public setFinalSumOfOrder(value): void {
    localStorage.setItem('finalSumOfOrder', JSON.stringify(value));
  }

  public getFinalSumOfOrder(): number {
    return JSON.parse(localStorage.getItem('finalSumOfOrder'));
  }

  public setTariffId(currentTariffId: number): void {
    localStorage.setItem('currentTariffId', String(currentTariffId));
  }

  public getTariffId(): number {
    return JSON.parse(localStorage.getItem('currentTariffId'));
  }

  public setAddressId(addressId: number): void {
    localStorage.setItem('addressId', String(addressId));
  }

  public getAddressId(): number {
    return JSON.parse(localStorage.getItem('addressId'));
  }

  public setAddresses(addresses: Address[]) {
    localStorage.setItem('addresses', String(addresses));
  }

  public getCurrentLocationId(): number {
    return JSON.parse(localStorage.getItem('currentLocationId'));
  }

  public getLocations(): CourierLocations {
    return JSON.parse(localStorage.getItem('locations'));
  }

  public getIsAnotherClient(): boolean {
    return JSON.parse(localStorage.getItem('anotherClient'));
  }

  public setIsAnotherClient(value: boolean) {
    localStorage.setItem('anotherClient', String(value));
  }

  public removeIsAnotherClient(): void {
    localStorage.removeItem('anotherClient');
  }
}
