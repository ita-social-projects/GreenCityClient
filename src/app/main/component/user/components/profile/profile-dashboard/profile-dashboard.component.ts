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
import { EventType } from 'src/app/ubs/ubs/services/event-type.enum';

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

  public isOnlineChecked = false;
  public isOfflineChecked = false;

  public eventsList: EventPageResponceDto[] = [];
  public eventsPerPage = 6;
  public eventsPage = 1;
  public totalEvents = 0;

  private hasNext = true;
  private currentPage: number;
  private newsCount = 3;

  public totalNews = 0;

  public eventType = '';

  public userLatitude = 0;
  public userLongitude = 0;

  authorNews$ = this.store.select((state: IAppState): IEcoNewsState => state.ecoNewsState);

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
    this.getUserLocation();

    this.localStorageService.setCurentPage('previousPage', '/profile');

    this.route.params.subscribe((params) => {
      const tabId = +params?.tabId;

      if (!isNaN(tabId)) {
        this.selectedIndex = tabId;
      }
    });
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      if (position) {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
      }
    });
  }

  onCheckboxChange(EventTypeChecked?: string) {
    if (EventTypeChecked === EventType.ONLINE) {
      this.isOfflineChecked = false; // Uncheck checkbox2 when checkbox1 is checked
    } else if (EventTypeChecked === EventType.OFFLINE) {
      this.isOnlineChecked = false; // Uncheck checkbox1 when checkbox2 is checked
    }

    if (this.isOnlineChecked) {
      this.eventType = EventType.ONLINE;
    } else if (this.isOfflineChecked) {
      this.eventType = EventType.OFFLINE;
    } else if (!this.isOnlineChecked && !this.isOfflineChecked) {
      this.eventType = '';
    }

    this.initGetUserEvents(this.eventType);
  }

  initGetUserEvents(eventType?: string): void {
    this.eventService
      .getAllUserEvents(0, this.eventsPerPage, this.userLatitude, this.userLongitude, eventType)
      .pipe(take(1))
      .subscribe((res: EventResponseDto) => {
        this.eventsList = res.page;
        this.totalEvents = res.totalElements;
      });
  }

  onEventsPageChange(page: number, eventType?: string): void {
    this.eventsPage = page;
    this.eventService
      .getAllUserEvents(this.eventsPage - 1, 6, this.userLatitude, this.userLongitude, eventType)
      .pipe(take(1))
      .subscribe((res) => {
        this.eventsList = res.page;
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
