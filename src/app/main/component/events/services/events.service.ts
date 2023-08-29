import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { environment } from '@environment/environment';
import { EventResponseDto, PagePreviewDTO, DateEvent } from '../models/events.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {
  public currentForm: PagePreviewDTO;
  private backEnd = environment.backendLink;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private isAddressFillSubject: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([]);

  constructor(private http: HttpClient) {}

  public setIsAddressFill(dates?: object[], check?: boolean): void {
    const currentValues = this.isAddressFillSubject.getValue();
    let newArray;

    if (currentValues.some((el) => el === true)) {
      newArray =
        dates.length < currentValues.length
          ? currentValues.slice(0, dates.length)
          : currentValues.concat(Array(dates.length - currentValues.length).fill(undefined));
    } else if (dates.length && !check) {
      newArray = Array(dates.length).fill(undefined);
    }
    if (check) {
      newArray = dates.reduce((currentValue: boolean[], nextValue: DateEvent) => {
        const hasPlace = nextValue.coordinatesDto.latitude || nextValue.onlineLink;
        return [...currentValue, hasPlace];
      }, []);
    }
    this.isAddressFillSubject.next(newArray);
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
