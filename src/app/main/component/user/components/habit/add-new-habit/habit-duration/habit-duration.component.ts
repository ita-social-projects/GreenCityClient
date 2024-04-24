import { Component, ElementRef, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
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
  public langChangeSub: Subscription;
  public newDuration = 7;
  public currentLang = '';
  public thumbTextEl: HTMLElement;
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
    this.thumbTextEl = this.elm.nativeElement.querySelector('.mat-slider-thumb-label-text');
    if (this.thumbTextEl) {
      this.updateThumbText();
      this.thumbTextEl.addEventListener('eventName', this.updateInput.bind(this));
    }
    this.updateDuration(this.newDuration);
  }

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
    if (this.thumbTextEl) {
      this.thumbTextEl.removeEventListener('eventName', this.updateInput.bind(this));
    }
  }

  public updateDuration(newDuration: number) {
    this.changeDuration.emit(newDuration);
  }

  public updateInput(newDuration: number) {
    this.newDuration = newDuration;
    this.updateDuration(this.newDuration);
  }

  public formatLabel(value: number): string {
    return value + this.days;
  }

  public updateThumbText() {
    if (this.thumbTextEl) {
      this.thumbTextEl.textContent = this.currentLang === 'ua' ? this.newDuration + 'дн' : this.newDuration + 'd';
    }
  }

  public subscribeToLangChange(): void {
    this.langChangeSub = this.translate.onDefaultLangChange.subscribe((res) => {
      const translations = res.translations;
      this.days = translations.user.habit.duration.day;
      this.updateThumbText();
    });
  }
}
