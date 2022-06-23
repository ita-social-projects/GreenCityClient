import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { EventPageResponceDto, EventResponseDto } from 'src/app/main/component/events/models/events.interface';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { GetEcoEventsByPageAction, GetEcoEventsByPageSuccessAction } from '../actions/ecoEvents.actions';
import { IAppState } from '../state/app.state';
import { IEcoEventsState } from '../state/ecoEvents.state';

@Injectable()
export class EventsEffects {
  constructor(private actions: Actions, private eventsService: EventsService, private store: Store) {}

  getEcoEventsByPage = createEffect(() => {
    return this.actions.pipe(
      ofType(GetEcoEventsByPageAction),
      mergeMap((actions: { currentPage: number; numberOfEvents: number; reset: boolean }) => {
        let eventsListState: EventPageResponceDto[];
        this.store
          .select((state: IAppState): IEcoEventsState => state.ecoEventsState)
          .subscribe((res) => {
            eventsListState = res.eventsList[actions.currentPage];
          });
        if (!eventsListState) {
          return this.eventsService.getEvents(actions.currentPage, actions.numberOfEvents).pipe(
            map(
              (ecoEvents: EventResponseDto) =>
                GetEcoEventsByPageSuccessAction({ ecoEvents, currentPage: actions.currentPage, reset: actions.reset }),
              catchError(() => EMPTY)
            )
          );
        } else {
          return of(GetEcoEventsByPageSuccessAction({ ecoEvents: false, currentPage: actions.currentPage, reset: actions.reset }));
        }
      })
    );
  });

  // editNews = createEffect(() => {
  //   return this.actions.pipe(
  //     ofType(EditEcoNewsAction),
  //     mergeMap((actions: { form: NewsDTO }) => {
  //       return this.createEcoNewsService.editNews(actions.form).pipe(
  //         map(
  //           (editedNews: EcoNewsModel) => EditEcoNewsSuccessAction({ editedNews }),
  //           catchError(() => EMPTY)
  //         )
  //       );
  //     })
  //   );
  // });
}
