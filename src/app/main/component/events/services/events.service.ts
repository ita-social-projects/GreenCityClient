import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { environment } from '@environment/environment';
import { EventResponseDto, PagePreviewDTO } from '../models/events.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {
  public currentForm: PagePreviewDTO;
  private backEnd = environment.backendLink;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private isAddressFillSubject: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([]);

  constructor(private http: HttpClient) {}

  public setIsAddressFill(value?: boolean, i?: number, check?: 'Check'): void {
    const currentValues = this.isAddressFillSubject.getValue();
    if (i !== undefined && value !== undefined) {
      currentValues[i] = value;
    } else if (i !== undefined) {
      let newValues;
      if (currentValues.length === 1) {
        newValues = Array(i).fill(undefined);
      } else if (i < currentValues.length) {
        newValues = currentValues.slice(0, i);
      } else {
        const additionalValues = Array(i - currentValues.length).fill(undefined);
        newValues = currentValues.concat(additionalValues);
      }
      this.isAddressFillSubject.next(newValues);
    }
    if (check) {
      const newValues = currentValues.map((el) => (el === undefined ? true : el));
      if (currentValues.length === 0) {
        this.isAddressFillSubject.next([true]);
      } else if (newValues.some((el) => el === undefined)) {
        const updatedValues = newValues.map((el) => el !== false);
        this.isAddressFillSubject.next(updatedValues);
      } else {
        this.isAddressFillSubject.next(newValues);
      }
    }
  }

  public getIsAddressFillObservable(): Observable<boolean[]> {
    return this.isAddressFillSubject.asObservable();
  }

  public getImageAsFile(img: string): Observable<Blob> {
    return this.http.get(img, { responseType: 'blob' });
  }

  public setForm(form: PagePreviewDTO): void {
    this.currentForm = form;
  }

  public getForm(): PagePreviewDTO {
    return this.currentForm;
  }

  public createEvent(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/create`, formData);
  }

  public editEvent(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.backEnd}events/update`, formData);
  }

  public getEvents(page: number, quantity: number): Observable<any> {
    return this.http.get(`${this.backEnd}events?page=${page}&size=${quantity}`);
  }

  public getSubscribedEvents(page: number, quantity: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events/myEvents?page=${page}&size=${quantity}`);
  }

  public getCreatedEvents(page: number, quantity: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events/myEvents/createdEvents?page=${page}&size=${quantity}`);
  }

  public getAllUserEvents(
    page: number,
    quantity: number,
    userLatitude: number,
    userLongitude: number,
    eventType: string = ''
  ): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(
      `${this.backEnd}events/myEvents?eventType=${eventType}&page=${page}&size=${quantity}&` +
        `userLatitude=${userLatitude}&userLongitude=${userLongitude}`
    );
  }

  public getEventById(id: number): Observable<any> {
    return this.http.get(`${this.backEnd}events/event/${id}`);
  }

  public deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.backEnd}events/delete/${id}`);
  }

  public rateEvent(id: number, grade: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/rateEvent/${id}/${grade}`, null);
  }

  public addAttender(id: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/addAttender/${id}`, { observe: 'response' });
  }

  public removeAttender(id: number): Observable<any> {
    return this.http.delete<any>(`${this.backEnd}events/removeAttender/${id}`);
  }

  public getAllAttendees(id: number): Observable<any> {
    return this.http.get<any>(`${this.backEnd}events/getAllSubscribers/${id}`);
  }

  createAdresses(coordinates, lenguage: string) {
    const devider = `, `;
    return (
      coordinates[`country${lenguage}`] +
      devider +
      coordinates[`city${lenguage}`] +
      devider +
      coordinates[`street${lenguage}`] +
      devider +
      coordinates.houseNumber
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
