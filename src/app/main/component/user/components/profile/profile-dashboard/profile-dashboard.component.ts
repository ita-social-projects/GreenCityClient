import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HabitService } from '@global-service/habit/habit.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HabitAssignInterface } from '../../../../../interface/habit/habit-assign.interface';
import { HabitStatus } from '../../../../../model/habit/HabitStatus.enum';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  loading = false;
  habitsInProgress: Array<HabitAssignInterface> = [];
  habitsAcquired: Array<HabitAssignInterface> = [];
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
    private habitService: HabitService,
    private habitAssignService: HabitAssignService,
    private ecoNewsService: EcoNewsService
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.getUserId();
    this.getNews(this.currentPage, this.newsCount);
  }

  public changeStatus(habit: HabitAssignInterface) {
    this.habitsInProgress = this.habitsInProgress.filter((el) => el.id !== habit.id);
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
        this.habitsInProgress = sortedHabits.filter((habit) => habit.status === HabitStatus.INPROGRESS);
        this.habitsAcquired = sortedHabits.filter((habit) => habit.status === HabitStatus.ACQUIRED);
        this.loading = false;
      });
  }

  private sortHabitsAsc(habitsArray): Array<HabitAssignInterface> {
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

  private getNews(page, count): void {
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
    console.log(this.isActiveInfinityScroll);
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
