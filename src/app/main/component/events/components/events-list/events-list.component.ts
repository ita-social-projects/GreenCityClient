import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventPageResponceDto, EventResponseDto, PaginationInterface } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { ReplaySubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoEventsState } from 'src/app/store/state/ecoEvents.state';
import { GetEcoEventsByPageAction } from 'src/app/store/actions/ecoEvents.actions';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {
  public eventsList: EventPageResponceDto[] = [];

  public isLoggedIn: string;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  public items = 1;
  public total = 0;
  public page = 0;

  public pageConfig(items: number, page: number, total: number): PaginationInterface {
    return {
      itemsPerPage: items,
      currentPage: page,
      totalItems: total
    };
  }

  ecoEvents$ = this.store.select((state: IAppState): IEcoEventsState => state.ecoEventsState);
  paginationArr = [];

  constructor(
    private store: Store,
    private eventService: EventsService,
    private userOwnAuthService: UserOwnAuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.localStorageService.setEditMode('canUserEdit', false);
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();

    this.ecoEvents$.subscribe((res: IEcoEventsState) => {
      this.paginationArr = res.visitedPages;
      this.total = res.totalPages;
      this.page = res.pageNumber;
      this.eventsList = res.eventsList[this.page];
      if (!this.paginationArr.some((it) => it === 0)) {
        this.store.dispatch(GetEcoEventsByPageAction({ currentPage: this.page, numberOfEvents: 3, reset: true }));
      }
    });
  }

  public checkPagination(): boolean {
    return this.total > this.items;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => (this.isLoggedIn = data && data.userId));
  }

  public setPage(event: number): void {
    this.store.dispatch(GetEcoEventsByPageAction({ currentPage: event - 1, numberOfEvents: 3, reset: false }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
