import { Injectable, OnDestroy } from '@angular/core';
import { EventForm, EventListResponse } from '../models/events.interface';

@Injectable()
export class EventStoreService implements OnDestroy {
  private state: { eventListResponse: EventListResponse; eventAuthorId: number; editorValues: EventForm } = {
    editorValues: { eventInformation: undefined, dateInformation: undefined },
    eventAuthorId: undefined,
    eventListResponse: undefined
  };

  constructor() {}

  setEditorValues(value: EventForm) {
    this.state.editorValues = value;
  }

  getEditorValues(): EventForm {
    return this.state.editorValues;
  }

  setEventListResponse(response: EventListResponse) {
    const { organizer } = response;
    this.setEventAuthorId(organizer.id);
  }

  setEventAuthorId(id: number) {
    this.state.eventAuthorId = id;
  }

  getEventAuthorId(): number {
    return this.state.eventAuthorId;
  }

  ngOnDestroy() {
    this.state = null;
  }
}
