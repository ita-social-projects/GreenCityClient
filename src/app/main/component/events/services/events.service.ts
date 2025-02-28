import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, ReplaySubject } from 'rxjs';

import { LanguageService } from 'src/app/main/i18n/language.service';
import {
  Addresses,
  EventAttender,
  EventForm,
  EventResponse,
  EventResponseDto,
  LocationResponse,
  EventDto,
  PlaceOnline
} from '../models/events.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {
  currentForm: EventResponse;
  private backEnd = environment.backendLink;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private divider = `, `;
  private isFromCreateEvent: boolean;
  private event: EventDto;

  constructor(
    private http: HttpClient,
    private langService: LanguageService
  ) {}

  setEvent(event: EventForm): void {
    if (!event) {
      this.event = null;
    }
    this.event = { ...this.event, ...event };
  }

  getEvent(): EventDto {
    return this.event;
  }

  prepareForSumbit(eventInformation, dates, images, id, isUpdating): FormData {
    let sendEventDto = {
      ...eventInformation,
      datesLocations: dates.map((item) => {
        if (!item.coordinates.latitude && !item.coordinates.longitude) {
          delete item.coordinates;
        }
        if (!item.onlineLink) {
          delete item.onlineLink;
        }
        return item;
      })
    };

    //TODO:
    if (isUpdating) {
      const currentImages = (images || []).filter((value) => !value.file).map((value) => value.url);
      sendEventDto = {
        ...sendEventDto,
        additionalImages: currentImages.slice(1),
        id,
        titleImage: currentImages[0]
      };
    }

    const formData: FormData = new FormData();
    const stringifyDataToSend = JSON.stringify(sendEventDto);
    const dtoName = isUpdating ? 'eventDto' : 'addEventDtoRequest';
    formData.append(dtoName, stringifyDataToSend);
    images.forEach((item) => {
      if (item.file) {
        formData.append('images', item.file);
      }
    });
    return formData;
  }
  setIsFromCreateEvent(value: boolean): void {
    this.isFromCreateEvent = value;
  }

  getIsFromCreateEvent(): boolean {
    return this.isFromCreateEvent;
  }

  getAddresses(): Observable<Addresses[]> {
    return this.http.get<Addresses[]>(`${this.backEnd}events/addresses`);
  }

  getImageAsFile(img: string): Observable<Blob> {
    return this.http.get(img, { responseType: 'blob' });
  }

  createEvent(formData: FormData): Observable<EventDto> {
    this.event = null;
    return this.http.post<EventDto>(`${this.backEnd}events/createV2`, formData);
  }

  editEvent(formData: FormData, eventId: number): Observable<EventDto> {
    return this.http.put<EventDto>(`${this.backEnd}events/updateV2/${eventId}`, formData);
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
    return this.http.get<EventResponseDto>(`${this.backEnd}events?page=${page}&size=${quantity}&statuses=SAVED&user-id=${userId}`);
  }

  getEventById(eventId: number): Observable<EventDto> {
    return this.http.get<EventDto>(`${this.backEnd}events/v2/${eventId}`);
  }

  getIsLikedByUser(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.backEnd}events/${eventId}/likes`);
  }

  postToggleLike(eventId: number): Observable<any> {
    return this.http.post(`${this.backEnd}events/${eventId}/like`, {});
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.backEnd}events/${eventId}`);
  }

  rateEvent(eventId: number, grade: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/${eventId}/ratings`, grade);
  }

  addAttender(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/${eventId}/attenders`, { observe: 'response' });
  }

  removeAttender(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.backEnd}events/${eventId}/attenders`);
  }

  getAllAttendees(eventId: number): Observable<EventAttender[]> {
    return this.http.get<EventAttender[]>(`${this.backEnd}events/${eventId}/attenders`);
  }

  getFormattedAddress(coordinates: PlaceOnline): string {
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

  createAddresses(location: PlaceOnline | null, lang: string): string {
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
