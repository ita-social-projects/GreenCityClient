import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
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
    private langService: LanguageService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.newDuration = this.habitDurationInitial;
    this.currentLang = this.langService.getCurrentLanguage();
    this.days = this.currentLang === 'ua' ? 'дн' : 'd';
    this.subscribeToLangChange();
    this.updateDuration(this.newDuration);
  }

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  public updateDuration(newDuration: number) {
    this.changeDuration.emit(newDuration);
  }

  public updateInput(newDuration: number) {
    this.newDuration = newDuration;
    this.updateDuration(this.newDuration);
  }

  public formatLabel(days: string): (value: number) => string {
    return (value: number) => `${value}${days}`;
  }

  public subscribeToLangChange(): void {
    this.langChangeSub = this.translate.onDefaultLangChange.subscribe((res) => {
      const translations = res.translations;
      this.days = translations.user.habit.duration.day;
    });
  }
}
