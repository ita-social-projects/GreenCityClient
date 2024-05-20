import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private _linkSubject = new BehaviorSubject<string>(null);

  constructor() {}

  get $days() {
    return this._daysSubject.asObservable();
  }

  set days(value: any[]) {
    this._daysSubject.next(value);
  }

  resetSubjects() {
    this._linkSubject.next(null);
    this._locationSubject.next({ coords: null, place: null });
    this._daysSubject.next(Array(1));
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
}
