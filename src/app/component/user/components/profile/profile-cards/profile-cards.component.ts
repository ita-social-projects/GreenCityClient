import { LanguageService } from '@language-service/language.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { ProfileService } from '../profile-service/profile.service';

@Component({
  selector: 'app-profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent implements OnInit, OnDestroy {
  public profileSubscription: Subscription;
  public languageSunscription: Subscription;
  public factOfTheDay: CardModel;
  public error;

  constructor(
    private profileService: ProfileService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.languageSunscription = this.languageService.languageBehaviorSubject.subscribe(() => {
      this.getFactOfTheDay();
    });
  }

  getFactOfTheDay(): void {
    this.profileSubscription = this.profileService.getFactsOfTheDay()
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
    this.languageSunscription.unsubscribe();
  }
}
