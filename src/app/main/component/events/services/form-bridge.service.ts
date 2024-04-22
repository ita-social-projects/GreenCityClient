import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormBridgeService {
  // TODO change any to form type
  public dayMap = new Map<number, Date | undefined>();
  private locationSubject: BehaviorSubject<{
    address: string;
    coords: google.maps.LatLngLiteral;
  }> = new BehaviorSubject({ address: '', coords: { lng: 0, lat: 0 } });
  private daysSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(Array(1));
  private datesFormSubjects: Subject<{ value: boolean; key: number; form?: any }> = new Subject<{
    value: boolean;
    key: any;
    form?: any;
  }>();
  private formsValidnessSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  get $datesFormStatus() {
    return this.datesFormSubjects.asObservable();
  }

  get $formsIsValid() {
    return this.formsValidnessSubject.asObservable();
  }

  get $days() {
    return this.daysSubject.asObservable();
  }

  set days(value: any[]) {
    this.daysSubject.next(value);
  }

  updateFormsValidStatus(value: boolean) {
    this.formsValidnessSubject.next(value);
  }

  setLocationForAll(location: { address: string; coords: google.maps.LatLngLiteral }) {
    this.locationSubject.next(location);
  }

  $locationUpdate() {
    return this.locationSubject.asObservable();
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
    this.datesFormSubjects.next({ value, key, form });
  }
}
