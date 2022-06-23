import { EventPageResponceDto, EventResponseDto } from 'src/app/main/component/events/models/events.interface';

export interface IEcoEventsState {
  eventState: EventResponseDto;
  // eventsList: [EventPageResponceDto[]];
  eventsList: any[];
  visitedPages: any[];
  totalPages: number;
  pageNumber: number;

  error: string | null;
}

export const initialEventsState: IEcoEventsState = {
  eventState: null,
  eventsList: [],
  visitedPages: [],
  totalPages: 0,
  pageNumber: 0,
  error: null
};
