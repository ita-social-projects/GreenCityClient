import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '@environment/environment';
import {
  Addresses,
  EventFilterCriteriaInterface,
  EventForm,
  EventResponse,
  EventResponseDto,
  LocationResponse,
  PagePreviewDTO
} from '../models/events.interface';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {
  currentForm: PagePreviewDTO | EventResponse;
  private eventPreview: PagePreviewDTO;
  private event: EventForm;
  private backEnd = environment.backendLink;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private divider = `, `;
  private isFromCreateEvent: boolean;

  constructor(
    private http: HttpClient,
    private langService: LanguageService
  ) {}

  setEvent(event: EventForm): void {
    this.event = event;
    this.eventPreview = this.convertEventToPreview(event);
  }

  setIsFromCreateEvent(value: boolean): void {
    this.isFromCreateEvent = value;
  }

  getIsFromCreateEvent(): boolean {
    return this.isFromCreateEvent;
  }
  private convertEventToPreview(event: EventForm): PagePreviewDTO {
    const { eventInformation, dateInformation } = event;

    return {
      title: eventInformation.title,
      description: eventInformation.description,
      eventDuration: eventInformation.duration,
      open: eventInformation.open,
      editorText: eventInformation.editorText,
      dates: dateInformation.map((dateInfo) => {
        const startDate = new Date(dateInfo.day.date);
        startDate.setHours(parseInt(dateInfo.day.startTime.split(':')[0], 10), parseInt(dateInfo.day.startTime.split(':')[1], 10));

        const finishDate = new Date(dateInfo.day.date);
        finishDate.setHours(parseInt(dateInfo.day.endTime.split(':')[0], 10), parseInt(dateInfo.day.endTime.split(':')[1], 10));

        return {
          startDate: startDate.toISOString(),
          finishDate: finishDate.toISOString(),
          onlineLink: dateInfo.placeOnline.onlineLink,
          place: dateInfo.placeOnline.place,
          coordinates: dateInfo.placeOnline.coordinates
            ? {
                latitude: dateInfo.placeOnline.coordinates.lat,
                longitude: dateInfo.placeOnline.coordinates.lng
              }
            : undefined
        };
      }),
      tags: eventInformation.tags,
      imgArray: eventInformation.images.map((image) => image.url),
      imgArrayToPreview: eventInformation.images.filter((image) => image.main).map((image) => image.url),
      location: dateInformation
        .map((dateInfo) => dateInfo.placeOnline.place)
        .filter((place) => place)
        .join(', ')
    };
  }
  getEventPriview(): PagePreviewDTO {
    return this.eventPreview;
  }
  getEvent(): EventForm {
    return this.event;
  }
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
    return this.eventPreview;
  }

  createEvent(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/create`, formData);
  }

  editEvent(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.backEnd}events/update`, formData);
  }

  getEvents(page: number, quantity: number, filter: EventFilterCriteriaInterface, searchTitle?: string): Observable<EventResponseDto> {
    let requestParams = new HttpParams();
    requestParams = requestParams.append('page', page.toString());
    requestParams = requestParams.append('size', quantity.toString());
    requestParams = requestParams.append('cities', filter.cities.toString().toUpperCase());
    requestParams = requestParams.append('tags', filter.tags.toString().toUpperCase());
    requestParams = requestParams.append('eventTime', filter.eventTime.toString().toUpperCase());
    requestParams = requestParams.append('statuses', filter.statuses.toString().toUpperCase());
    if (searchTitle) {
      requestParams = requestParams.append('title', searchTitle);
    }
    return this.http.get<EventResponseDto>(`${this.backEnd}events`, { params: requestParams });
  }

  getSubscribedEvents(page: number, quantity: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events/myEvents?page=${page}&size=${quantity}`);
  }

  getCreatedEvents(page: number, quantity: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events/myEvents/createdEvents?page=${page}&size=${quantity}`);
  }

  getAllUserEvents(
    page: number,
    quantity: number,
    userLatitude: number,
    userLongitude: number,
    eventType = ''
  ): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(
      `${this.backEnd}events/myEvents?eventType=${eventType}&page=${page}&size=${quantity}&` +
        `userLatitude=${userLatitude}&userLongitude=${userLongitude}`
    );
  }

  addEventToFavourites(eventId: number): Observable<void> {
    return this.http.post<void>(`${this.backEnd}events/addToFavorites/${eventId}`, eventId);
  }

  removeEventFromFavourites(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.backEnd}events/removeFromFavorites/${eventId}`);
  }

  getUserFavoriteEvents(page: number, quantity: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events/getAllFavoriteEvents?page=${page}&size=${quantity}`);
  }

  getEventById(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.backEnd}events/event/${id}`);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.backEnd}events/delete/${id}`);
  }

  rateEvent(id: number, grade: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/rateEvent/${id}/${grade}`, null);
  }

  addAttender(id: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/addAttender/${id}`, { observe: 'response' });
  }

  removeAttender(id: number): Observable<any> {
    return this.http.delete<any>(`${this.backEnd}events/removeAttender/${id}`);
  }

  getAllAttendees(id: number): Observable<any> {
    return this.http.get<any>(`${this.backEnd}events/getAllSubscribers/${id}`);
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
        : coordinates.formattedAddressUa.split(', ').slice(0, 2).reverse().join(', '),
      coordinates.streetEn
        ? this.createEventsListAddresses(coordinates, 'En')
        : coordinates.formattedAddressEn.split(', ').slice(0, 2).reverse().join(', ')
    );
  }

  createAddresses(coord: LocationResponse | null, lang: string): string {
    if (!coord) {
      return '';
    }
    const parts = [coord[`country${lang}`], coord[`city${lang}`], coord[`street${lang}`], coord.houseNumber];
    return parts.join(this.divider);
  }

  createEventsListAddresses(coord: LocationResponse | null, lang: string): string {
    if (!coord) {
      return '';
    }
    const addressParts = [coord[`city${lang}`], coord[`street${lang}`], coord.houseNumber];
    return addressParts.join(this.divider);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
