import { Directive, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Directive({
  selector: '[appLangValue]'
})
export class LangValueDirective implements OnInit, OnDestroy, OnChanges {
  @Input('appLangValue') values: { ua: string; en: string } | { ua: string[]; en: string[] };
  @Input('prefix') prefix: string;
  @Input('suffix') suffix: string;

  private el: ElementRef = inject(ElementRef);
  private languageService: LanguageService = inject(LanguageService);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.languageService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateLangValue();
      });
    this.updateLangValue(); // Initialize the value on directive load
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateLangValue();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateLangValue() {
    this.el.nativeElement.textContent = `${this.prefix ?? ''}${this.languageService.getLangValue(this.values.ua, this.values.en)}${this.suffix ?? ''}`;
  }
}
