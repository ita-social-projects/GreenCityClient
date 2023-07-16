import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitStatus } from '../../../../../model/habit/HabitStatus.enum';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoNewsState } from 'src/app/store/state/ecoNews.state';
import { GetEcoNewsByAuthorAction } from 'src/app/store/actions/ecoNews.actions';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { EventPageResponceDto, EventResponseDto } from 'src/app/main/component/events/models/events.interface';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { ActivatedRoute } from '@angular/router';
import { ShoppingListService } from '@global-user/components/habit/add-new-habit/habit-edit-shopping-list/shopping-list.service';
import { HabitAssignInterface } from '@global-user/components/habit/models/interfaces/habit-assign.interface';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  loading = false;
  numberOfHabitsOnView = 3;
  habitsAcquired: Array<HabitAssignInterface> = [];
  habitsAcquiredToView: Array<HabitAssignInterface> = [];
  public selectedIndex = 0;
  public tabs = {
    habits: true,
    news: false,
    articles: false
  };
  isActiveInfinityScroll = false;
  userId: number;
  news: EcoNewsModel[];

  public eventsList: EventPageResponceDto[] = [];
  public eventsPerPage = 6;
  public eventsPage = 1;
  public eventsTotal = 0;

  private hasNext = true;
  private currentPage: number;
  private newsCount = 3;

  public totalNews = 0;

  authorNews$ = this.store.select((state: IAppState): IEcoNewsState => state.ecoNewsState);

  public userLatitude: number;
  public userLongitude: number;

  constructor(
    private localStorageService: LocalStorageService,
    public habitAssignService: HabitAssignService,
    public shoppingService: ShoppingListService,
    private store: Store,
    private eventService: EventsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.getUserId();

    this.getLocation();

    this.authorNews$.subscribe((val: IEcoNewsState) => {
      this.currentPage = val.authorNewsPage;
      if (val.ecoNewsByAuthor) {
        this.totalNews = val.ecoNewsByAuthor.totalElements;
        this.hasNext = val.ecoNewsByAuthor.hasNext;
        this.news = val.autorNews;
      }
    });

    this.initGetUserEvents();
    this.dispatchNews(false);

    this.localStorageService.setCurentPage('previousPage', '/profile');

    this.route.params.subscribe((params) => {
      const tabId = +params?.tabId;

      if (!isNaN(tabId)) {
        this.selectedIndex = tabId;
      }
    });
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      if (position) {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
      }
    });
  }

  initGetUserEvents(): void {
    this.eventService
      .getAllUserEvents(0, this.eventsPerPage)
      .pipe(take(1))
      .subscribe((res: EventResponseDto) => {
        this.eventsList = this.getSortedEvents(res.page, this.userLatitude, this.userLongitude) || [];
        this.eventsTotal = res.totalElements;
      });
  }

  onEventsPageChange(page: number): void {
    this.eventsPage = page;
    this.eventService
      .getAllUserEvents(this.eventsPage - 1, 6)
      .pipe(take(1))
      .subscribe((res) => {
        this.eventsList = this.getSortedEvents(res.page, this.userLatitude, this.userLongitude) || [];
      });
  }

  public dispatchNews(res: boolean) {
    if (this.currentPage !== undefined && this.hasNext) {
      this.store.dispatch(
        GetEcoNewsByAuthorAction({
          currentPage: this.currentPage,
          numberOfNews: this.newsCount,
          reset: res
        })
      );
    }
  }

  public getSortedEvents(events: EventPageResponceDto[], userLat: number, userLon: number): EventPageResponceDto[] {
    return [
      ...events
        .filter(
          (event) =>
            event.dates[event.dates.length - 1].onlineLink && !this.eventService.isEventOver(event.dates[event.dates.length - 1].finishDate)
        )
        .sort(
          (a, b) => new Date(b.dates[b.dates.length - 1].finishDate).getTime() - new Date(a.dates[a.dates.length - 1].finishDate).getTime()
        ),
      ...events
        .filter(
          (event) =>
            !event.dates[event.dates.length - 1].onlineLink &&
            !this.eventService.isEventOver(event.dates[event.dates.length - 1].finishDate)
        )
        .map((event) => {
          return {
            ...event,
            distance: this.eventService.getDistanceFromLatLonInKm(
              userLat,
              userLon,
              event.dates[event.dates.length - 1].coordinates.latitude,
              event.dates[event.dates.length - 1].coordinates.longitude
            )
          };
        })
        .sort((a, b) => a.distance - b.distance),
      ...events.filter((event) => this.eventService.isEventOver(event.dates[event.dates.length - 1].finishDate))
    ];
  }

  public changeStatus(habit: HabitAssignInterface) {
    this.habitAssignService.habitsInProgress = this.habitAssignService.habitsInProgress.filter((el) => el.id !== habit.id);
    this.habitsAcquired = [...this.habitsAcquired, habit];
  }

  private getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  private subscribeToLangChange() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => this.executeRequests());
  }

  public executeRequests() {
    this.loading = true;
    this.habitAssignService
      .getAssignedHabits()
      .pipe(take(1))
      .subscribe((response: Array<HabitAssignInterface>) => {
        const sortedHabits = this.sortHabitsData(response);
        this.habitAssignService.habitsInProgress = sortedHabits.filter((habit) => habit.status === HabitStatus.INPROGRESS);
        this.habitsAcquired = sortedHabits.filter((habit) => habit.status === HabitStatus.ACQUIRED);
        this.setHabitsForView();
        this.loading = false;
      });
  }

  setHabitsForView(): void {
    this.habitAssignService.habitsInProgressToView = [...this.habitAssignService.habitsInProgress.slice(0, this.numberOfHabitsOnView)];
    this.habitsAcquiredToView = [...this.habitsAcquired.slice(0, this.numberOfHabitsOnView)];
  }

  getMoreHabitsInProgressForView(): void {
    this.habitAssignService.habitsInProgressToView = this.getMoreHabits(
      this.habitAssignService.habitsInProgressToView,
      this.habitAssignService.habitsInProgress
    );
  }

  getMoreHabitsAcquiredForView(): void {
    this.habitsAcquiredToView = this.getMoreHabits(this.habitsAcquiredToView, this.habitsAcquired);
  }

  getMoreHabits(habitsOnView: Array<HabitAssignInterface>, allHabits: Array<HabitAssignInterface>): Array<HabitAssignInterface> {
    const currentNumberOfHabitsOnView = habitsOnView.length;
    return [...habitsOnView, ...allHabits.slice(currentNumberOfHabitsOnView, currentNumberOfHabitsOnView + this.numberOfHabitsOnView)];
  }

  private sortHabitsData(habitsArray: HabitAssignInterface[]): Array<HabitAssignInterface> {
    return habitsArray.sort((firstHabit, secondHabit) => {
      return firstHabit.createDateTime > secondHabit.createDateTime ? -1 : 1;
    });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.isActiveInfinityScroll = tabChangeEvent.index === 1;
  }

  onScroll(): void {
    this.dispatchNews(false);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
