import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { ProfileService } from '../profile-service/profile.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent implements OnInit, OnDestroy {
  profileSubscription: Subscription;
  languageSubscription: Subscription;
  factOfTheDay: CardModel;
  error: string;

  constructor(
    private profileService: ProfileService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.languageSubscription = this.localStorageService.languageBehaviourSubject.subscribe(() => {
      this.getFactOfTheDay();
    });
  }

  getFactOfTheDay(): void {
    this.profileSubscription = this.profileService
      .getFactsOfTheDay()
      .pipe(
        catchError((error) => {
          this.error = error;
          return error;
        })
      )
      .subscribe((success: CardModel) => {
        this.factOfTheDay = { ...success };
      });
  }

  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }
}
