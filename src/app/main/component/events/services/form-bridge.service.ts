import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormBridgeService {
  private locationSubject: Subject<{ address: string; coords: google.maps.LatLngLiteral }> = new Subject();
  private daysSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(Array(1));
  private informationSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private datesFormSubjects: Subject<any> = new Subject<any>();
  private formsValidnessSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private dayMap = new Map<number, Date | undefined>();

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
  updateFormStatus(value: boolean, key: any) {
    this.datesFormSubjects.next({ value, key });
  }
}
