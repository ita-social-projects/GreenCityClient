import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, of, timer } from 'rxjs';
import { FactOfTheDay } from '@global-user/models/factOfTheDay';
import { ProfileService } from '../profile-service/profile.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';

@Component({
  selector: 'app-profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  factOfTheDay: FactOfTheDay;
  habitFactOfTheDay: FactOfTheDay;
  error: string;
  oneDayInMillis = 24 * 60 * 60 * 1000;

  constructor(
    private profileService: ProfileService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadHabitFactFromLocalStorage();
      this.getFactOfTheDay();
      this.checkAndUpdateHabitFact();
    });

    timer(0, this.oneDayInMillis)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkAndUpdateHabitFact());
  }

  loadHabitFactFromLocalStorage(): void {
    this.habitFactOfTheDay = this.localStorageService.getHabitFactFromLocalStorage();
  }

  getFactOfTheDay(): void {
    this.profileService
      .getRandomFactOfTheDay()
      .pipe(
        catchError((error) => {
          this.error = error.message;
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((success: FactOfTheDay | null) => {
        if (success) {
          this.factOfTheDay = { ...success };
        }
      });
  }

  checkAndUpdateHabitFact(): void {
    this.profileService
      .getUserProfileStatistics()
      .pipe(
        catchError(() => of(null)),
        takeUntil(this.destroy$)
      )
      .subscribe((profileStats: ProfileStatistics) => {
        if (profileStats?.amountHabitsInProgress > 0) {
          this.updateHabitFactIfNeeded();
        } else {
          this.clearHabitFact();
        }
      });
  }

  updateHabitFactIfNeeded(): void {
    const lastHabitFetchTime = localStorage.getItem('lastHabitFactFetchTime');
    const currentTime = Date.now();
    const oneDay = this.oneDayInMillis;

    if (this.isMoreThanOneDayPassed(lastHabitFetchTime, currentTime, oneDay)) {
      this.clearHabitFact();

      this.profileService
        .getFactsOfTheDayByTags()
        .pipe(
          catchError(() => of(null)),
          takeUntil(this.destroy$)
        )
        .subscribe((fact: FactOfTheDay | null) => {
          if (fact) {
            this.habitFactOfTheDay = fact;
            this.localStorageService.saveHabitFactToLocalStorage(fact, currentTime);
          }
        });
    }
  }

  isMoreThanOneDayPassed(lastHabitFetchTime: string | null, currentTime: number, oneDay: number): boolean {
    return !lastHabitFetchTime || currentTime - Number(lastHabitFetchTime) > oneDay;
  }

  clearHabitFact(): void {
    this.habitFactOfTheDay = null;
    this.localStorageService.clearHabitFactFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
