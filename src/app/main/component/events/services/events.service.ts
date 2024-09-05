import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '@environment/environment';
import { Addresses, EventAttender, EventResponse, EventResponseDto, LocationResponse, PagePreviewDTO } from '../models/events.interface';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {
  currentForm: PagePreviewDTO | EventResponse;
  private backEnd = environment.backendLink;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private divider = `, `;

  constructor(
    private http: HttpClient,
    private langService: LanguageService
  ) {}

  getAddresses(): Observable<Addresses[]> {
    return this.http.get<Addresses[]>(`${this.backEnd}events/addresses`);
  }

  getImageAsFile(img: string): Observable<Blob> {
    return this.http.get(img, { responseType: 'blob' });
  }

  setForm(form: PagePreviewDTO | EventResponse): void {
    this.currentForm = form;
  }

  getForm(): PagePreviewDTO | EventResponse {
    return this.currentForm;
  }

  createEvent(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/`, formData);
  }

  editEvent(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.backEnd}events/}`, formData);
  }

  getEvents(requestParams: HttpParams): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events`, { params: requestParams });
  }

  addEventToFavourites(eventId: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}events/${eventId}/favorites`, eventId);
  }

  removeEventFromFavourites(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.backEnd}events/${eventId}/favorites`);
  }

  getUserFavoriteEvents(page: number, quantity: number, userId: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events?statuses=SAVED&user-id=${userId}&page=${page}&size=${quantity}`);
  }

  getEventById(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.backEnd}events/${id}`);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.backEnd}events/${id}`);
  }

  rateEvent(id: number, grade: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/${id}/rating/${grade}`, null);
  }

  addAttender(id: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/${id}/attenders`, { observe: 'response' });
  }

  removeAttender(id: number): Observable<any> {
    return this.http.delete<any>(`${this.backEnd}events/${id}/attenders`);
  }

  getAllAttendees(id: number): Observable<EventAttender[]> {
    return this.http.get<any>(`${this.backEnd}events/${id}/attenders`);
  }

  getFormattedAddress(coordinates: LocationResponse): string {
    return this.langService.getLangValue(
      coordinates?.streetUa ? this.createAddresses(coordinates, 'Ua') : coordinates?.formattedAddressUa,
      coordinates?.streetEn ? this.createAddresses(coordinates, 'En') : coordinates?.formattedAddressEn
    );
  }

  getFormattedAddressEventsList(coordinates: LocationResponse): string {
    return this.langService.getLangValue(
      coordinates.streetUa
        ? this.createEventsListAddresses(coordinates, 'Ua')
        : coordinates.formattedAddressUa?.split(', ').slice(0, 2).reverse().join(', ') || '',
      coordinates.streetEn
        ? this.createEventsListAddresses(coordinates, 'En')
        : coordinates.formattedAddressEn?.split(', ').slice(0, 2).reverse().join(', ') || ''
    );
  }

  createAddresses(location: LocationResponse | null, lang: string): string {
    if (!location) {
      return '';
    }
    return [location[`country${lang}`], location[`city${lang}`], location[`street${lang}`], location.houseNumber].join(this.divider);
  }

  createEventsListAddresses(location: LocationResponse | null, lang: string): string {
    if (!location) {
      return '';
    }
    return [location[`city${lang}`], location[`street${lang}`], location.houseNumber].join(this.divider);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
