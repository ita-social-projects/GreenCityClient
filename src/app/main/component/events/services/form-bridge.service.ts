import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormBridgeService {
  // TODO change any to form type
  public dayMap = new Map<number, Date | undefined>();

  private _locationSubject: BehaviorSubject<{
    place: string;
    coords: google.maps.LatLngLiteral;
  }> = new BehaviorSubject({ place: '', coords: { lng: 0, lat: 0 } });
  private _daysSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(Array(1));
  private _datesFormSubjects: Subject<{ value: boolean; key: number; form?: any }> = new Subject<{
    value: boolean;
    key: any;
    form?: any;
  }>();
  private _datesFormsValidnessSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _linkSubject = new BehaviorSubject<string>(null);

  constructor() {}

  get $datesFormStatus() {
    return this._datesFormSubjects.asObservable();
  }

  get $datesFormsIsValid() {
    return this._datesFormsValidnessSubject.asObservable();
  }

  get $days() {
    return this._daysSubject.asObservable();
  }

  set days(value: any[]) {
    this._daysSubject.next(value);
  }

  updateFormsValidStatus(value: boolean) {
    this._datesFormsValidnessSubject.next(value);
  }

  setLinkForAll(link: string) {
    this._linkSubject.next(link);
  }

  $linkUpdate(): Observable<string> {
    return this._linkSubject.asObservable();
  }

  setLocationForAll(location: { place: string; coords: google.maps.LatLngLiteral }) {
    this._locationSubject.next(location);
  }

  $locationUpdate() {
    return this._locationSubject.asObservable();
  }

  // start day filter
  deleteRecordFromDayMap(key: number): void {
    this.dayMap.delete(key);
  }

  changeDay(dayKey: number, date: Date): void {
    this.dayMap.set(dayKey, date);
  }

  getDayFromMap(dayKey: number): Date | undefined {
    return this.dayMap.get(dayKey);
  }

  getDaysLength() {
    return this.dayMap.size;
  }

  // end

  updateDatesFormStatus(value: boolean, key: number, form?: any) {
    this._datesFormSubjects.next({ value, key, form });
  }
}
