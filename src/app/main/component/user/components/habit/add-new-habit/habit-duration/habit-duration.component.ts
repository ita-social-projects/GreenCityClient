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
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/main/i18n/Language';
import { takeUntil } from 'rxjs/operators';
import { HABIT_DEFAULT_DURATION } from '../../const/data.const';

@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HabitDurationComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() habitDurationInitial = HABIT_DEFAULT_DURATION;
  @Output() changeDuration = new EventEmitter<number>();
  langChangeSub: Subscription;
  newDuration: number;
  currentLang = '';
  thumbTextEl: HTMLElement;
  days = 'd';
  private destroyRef = new Subject();

  constructor(
    private elem: ElementRef,
    private langService: LanguageService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.newDuration = this.habitDurationInitial;
    this.subscribeToLangChange();
    this.observeLanguageChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const durationChange = changes.habitDurationInitial;
    this.newDuration = durationChange.currentValue;
    this.updateDuration();
    if (this.thumbTextEl) {
      this.updateLabel();
    }
  }

  ngAfterViewInit(): void {
    this.currentLang = this.langService.getCurrentLanguage();
    this.initializeThumbTextEl();
    this.updateLabel();
  }

  ngOnDestroy() {
    this.destroyRef.next(true);
    this.destroyRef.complete();
  }

  updateDuration() {
    this.changeDuration.emit(this.newDuration);
  }

  subscribeToLangChange(): void {
    this.translate.onDefaultLangChange.pipe(takeUntil(this.destroyRef)).subscribe((res) => {
      const translations = res.translations;
      this.days = translations.user.habit.duration.day;
    });
  }

  private initializeThumbTextEl() {
    this.thumbTextEl = this.elem.nativeElement.getElementsByClassName('mdc-slider__value-indicator-text')[0];
  }

  updateLabel() {
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
