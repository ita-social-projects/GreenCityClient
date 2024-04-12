import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { MatSliderChange } from '@angular/material/slider';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/main/i18n/Language';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HabitDurationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() habitDurationInitial = 7;
  @Output() changeDuration = new EventEmitter<number>();
  public newDuration: number;
  public currentLang = '';
  public thumbTextEl;
  public langChangeSub: Subscription;
  public days = 'd';
  private destroyRef = new Subject();

  constructor(private elm: ElementRef, private langService: LanguageService, public translate: TranslateService) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.observeLanguageChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const durationChange = changes['habitDurationInitial'];

    if (durationChange.firstChange) {
      this.currentLang = this.langService.getCurrentLanguage();
      this.initializeThumbTextEl();
    }
    this.newDuration = durationChange.currentValue;
    this.updateDuration();
    this.updateLabel();
  }

  ngOnDestroy() {
    this.destroyRef.next();
    this.destroyRef.complete();
  }

  public updateDuration() {
    this.changeDuration.emit(this.newDuration);
  }

  public updateInput(event) {
    const sliderChangeEvent = event as MatSliderChange;
    const newSliderValue = sliderChangeEvent.value;
    this.thumbTextEl.textContent = newSliderValue + this.days;
    this.updateLabel();
  }

  public subscribeToLangChange(): void {
    this.translate.onDefaultLangChange.pipe(takeUntil(this.destroyRef)).subscribe((res) => {
      const translations = res.translations;
      this.days = translations.user.habit.duration.day;
      this.thumbTextEl.textContent = this.newDuration + this.days;
    });
  }

  private initializeThumbTextEl() {
    this.thumbTextEl = this.elm.nativeElement.getElementsByClassName('mat-slider-thumb-label-text')[0];
  }

  private updateLabel() {
    if (this.currentLang === Language.UA) {
      this.thumbTextEl.textContent = this.newDuration + 'дн';
    } else {
      this.thumbTextEl.textContent = this.newDuration + 'd';
    }
  }

  private observeLanguageChanges() {
    this.langService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroyRef))
      .subscribe((lang) => (this.currentLang = lang));
  }
}
