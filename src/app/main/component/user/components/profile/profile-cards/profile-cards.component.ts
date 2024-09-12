import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { Subscription, of, timer } from 'rxjs';
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
  profileSubscription: Subscription;
  languageSubscription: Subscription;
  dailyUpdateSubscription: Subscription;
  factOfTheDay: FactOfTheDay;
  habitFactOfTheDay: FactOfTheDay;
  error: string;

  constructor(
    private profileService: ProfileService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.languageSubscription = this.localStorageService.languageBehaviourSubject.subscribe(() => {
      this.loadFactsFromLocalStorage();
      this.getFactOfTheDay();
      this.checkAndUpdateHabitFact();
    });

    this.dailyUpdateSubscription = timer(0, 24 * 60 * 60 * 1000).subscribe(() => {
      this.checkAndUpdateHabitFact();
    });
  }

  loadFactsFromLocalStorage() {
    const savedHabitFact = localStorage.getItem('habitFactOfTheDay');
    const lastHabitFetchTime = localStorage.getItem('lastHabitFactFetchTime');
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (savedHabitFact && lastHabitFetchTime && currentTime - Number(lastHabitFetchTime) < oneDay) {
      this.habitFactOfTheDay = JSON.parse(savedHabitFact);
    } else {
      this.habitFactOfTheDay = null;
    }
  }

  getFactOfTheDay(): void {
    this.profileSubscription = this.profileService
      .getRandomFactOfTheDay()
      .pipe(
        catchError((error) => {
          this.error = error;
          return error;
        })
      )
      .subscribe((success: FactOfTheDay) => {
        this.factOfTheDay = { ...success };
      });
  }

  checkAndUpdateHabitFact(): void {
    this.profileService
      .getUserProfileStatistics()
      .pipe(
        take(1),
        catchError(() => of(null))
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
    const oneDay = 60 * 1000;

    if (!lastHabitFetchTime || currentTime - Number(lastHabitFetchTime) > oneDay) {
      this.clearHabitFact();

      this.profileService
        .getFactsOfTheDayByTags()
        .pipe(catchError(() => of(null)))
        .subscribe((fact: FactOfTheDay | null) => {
          if (fact) {
            this.habitFactOfTheDay = fact;
            localStorage.setItem('habitFactOfTheDay', JSON.stringify(fact));
            localStorage.setItem('lastHabitFactFetchTime', currentTime.toString());
          }
        });
    }
  }

  clearHabitFact(): void {
    this.habitFactOfTheDay = null;
    localStorage.removeItem('habitFactOfTheDay');
    localStorage.removeItem('lastHabitFactFetchTime');
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
    this.dailyUpdateSubscription.unsubscribe();
  }
}
