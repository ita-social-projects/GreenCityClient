import { Component, ElementRef, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { MatSliderChange } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss']
})
export class HabitDurationComponent implements OnInit, OnDestroy {
  @Input() habitDurationInitial: number;
  @Output() changeDuration = new EventEmitter<number>();
  public newDuration = 7;
  public currentLang = '';
  public thumbTextEl;
  public langChangeSub: Subscription;
  public days = 'd';

  constructor(
    private elm: ElementRef,
    private langService: LanguageService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.newDuration = this.habitDurationInitial;

    this.currentLang = this.langService.getCurrentLanguage();
    this.subscribeToLangChange();
    this.thumbTextEl = this.elm.nativeElement.getElementsByClassName('mat-slider-thumb-label-text')[0];

    if (this.currentLang === 'ua') {
      this.thumbTextEl.textContent = this.newDuration + 'дн';
    } else {
      this.thumbTextEl.textContent = this.newDuration + 'd';
    }
  }

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  public updateDuration() {
    this.changeDuration.emit(this.newDuration);
  }

  public updateInput(event) {
    const sliderChangeEvent = event as MatSliderChange;
    const newSliderValue = sliderChangeEvent.value;
    this.thumbTextEl.textContent = newSliderValue + this.days;
  }

  public subscribeToLangChange(): void {
    this.langChangeSub = this.translate.onDefaultLangChange.subscribe((res) => {
      const translations = res.translations;
      this.days = translations.user.habit.duration.day;
      this.thumbTextEl.textContent = this.newDuration + this.days;
    });
  }
}
