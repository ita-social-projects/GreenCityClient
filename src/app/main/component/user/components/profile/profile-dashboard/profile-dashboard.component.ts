import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitAssignInterface } from '../../../../../interface/habit/habit-assign.interface';
import { HabitStatus } from '../../../../../model/habit/HabitStatus.enum';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { IEcoNewsState } from 'src/app/store/state/ecoNews.state';
import { GetEcoNewsByAuthorAction } from 'src/app/store/actions/ecoNews.actions';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { EventPageResponceDto, EventResponseDto } from 'src/app/main/component/events/models/events.interface';
import { EventsService } from 'src/app/main/component/events/services/events.service';

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
  public tabs = {
    habits: true,
    news: false,
    articles: false
  };
  isActiveInfinityScroll = false;
  userId: number;
  news: EcoNewsModel[];

  public eventsList: EventPageResponceDto[] = [];
  public eventsByAuthorList: EventPageResponceDto[] = [];
  public UserEventList: EventPageResponceDto[] = [];
  public eventsPerPage = 6;
  public eventsPage = 1;
  public eventsTotal = 0;

  private hasNext = true;
  private currentPage: number;
  private newsCount = 3;

  public totalNews = 0;

  authorNews$ = this.store.select((state: IAppState): IEcoNewsState => state.ecoNewsState);

  constructor(
    private localStorageService: LocalStorageService,
    public habitAssignService: HabitAssignService,
    private store: Store,
    private eventService: EventsService
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.getUserId();
    this.dispatchNews(false);

    this.authorNews$.subscribe((val: IEcoNewsState) => {
      this.currentPage = val.authorNewsPage;
      if (val.ecoNewsByAuthor) {
        this.totalNews = val.ecoNewsByAuthor.totalElements;
        this.hasNext = val.ecoNewsByAuthor.hasNext;
        this.news = val.autorNews;
      }
    });

    this.eventService
      .getCreatedEvents(0, 100)
      .pipe(take(1))
      .subscribe((res: EventResponseDto) => {
        this.eventsByAuthorList = res.page;
        this.eventsTotal = res.totalElements;

        this.eventService
          .getUsersEvents(0, 100)
          .pipe(take(1))
          .subscribe((events: EventResponseDto) => {
            this.UserEventList = this.eventsByAuthorList.concat(events.page);
            this.eventsTotal = this.eventsTotal + events.totalElements;
            this.eventsList = this.UserEventList.slice(0, this.eventsPerPage);
          });
      });

    this.localStorageService.setCurentPage('previousPage', '/profile');
  }

  onEventsPageChange(page) {
    this.eventsPage = page;
    let startIndex = this.eventsPage - 1 + this.eventsPerPage;
    let endIndex = startIndex + this.eventsPerPage;
    if (page === 1) {
      startIndex = 0;
      endIndex = this.eventsPerPage;
    }
    if (endIndex > this.eventsTotal) {
      endIndex = this.eventsTotal;
    }
    this.eventsList = this.UserEventList.slice(startIndex, endIndex);
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
        const sortedHabits = this.sortHabitsAsc(response);
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

  private sortHabitsAsc(habitsArray: HabitAssignInterface[]): Array<HabitAssignInterface> {
    return habitsArray.sort((firstHabit, secondHabit) => {
      if (firstHabit.habit.id > secondHabit.habit.id) {
        return 1;
      }
      if (secondHabit.habit.id > firstHabit.habit.id) {
        return -1;
      }
      return 0;
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
