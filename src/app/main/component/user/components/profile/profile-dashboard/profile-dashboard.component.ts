import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitAssignInterface } from '../../../../../interface/habit/habit-assign.interface';
import { HabitStatus } from '../../../../../model/habit/HabitStatus.enum';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
  news: any;
  private totalPages: number;
  private currentPage = 0;
  private newsCount = 5;

  constructor(
    private localStorageService: LocalStorageService,
    public habitAssignService: HabitAssignService,
    private ecoNewsService: EcoNewsService
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.getUserId();
    this.getNews(this.currentPage, this.newsCount);
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

  private getNews(page: number, count: number): void {
    this.ecoNewsService
      .getEcoNewsListByPage(page, count)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((list: any) => {
        this.totalPages = list.totalPages;
        if (!this.news) {
          this.news = list.page;
        } else {
          this.news = [...this.news, ...list.page];
        }
      });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.isActiveInfinityScroll = tabChangeEvent.index === 1;
  }

  onScroll(): void {
    if (!this.loading && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getNews(this.currentPage, this.newsCount);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
