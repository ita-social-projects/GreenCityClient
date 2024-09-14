import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, Subscription, of, timer } from 'rxjs';
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

    timer(0, this.profileService.oneDayInMillis)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkAndUpdateHabitFact());
  }

  loadHabitFactFromLocalStorage(): void {
    this.habitFactOfTheDay = this.profileService.getHabitFactFromLocalStorage();
  }

  getFactOfTheDay(): void {
    this.profileService
      .getRandomFactOfTheDay()
      .pipe(
        catchError((error) => {
          this.error = error;
          return error;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((success: FactOfTheDay) => {
        this.factOfTheDay = { ...success };
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
    const oneDay = this.profileService.oneDayInMillis;

    // Only update habit fact if the last fetch was over 24 hours ago
    if (!lastHabitFetchTime || currentTime - Number(lastHabitFetchTime) > oneDay) {
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
            this.profileService.saveHabitFactToLocalStorage(fact, currentTime);
          }
        });
    }
  }

  clearHabitFact(): void {
    this.habitFactOfTheDay = null;
    this.profileService.clearHabitFactFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
