import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SecurityContext,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Directive({
  selector: '[appLangValue]'
})
export class LangValueDirective implements OnInit, OnDestroy, OnChanges {
  @Input() appLangValue: { ua: string; en: string } | { ua: string[]; en: string[] };
  @Input() appLangValueType: 'html' | 'text' = 'text';
  @Input() prefix: string;
  @Input() suffix: string;

  private el: ElementRef = inject(ElementRef);
  private languageService: LanguageService = inject(LanguageService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private renderer: Renderer2 = inject(Renderer2);
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
    const langValue = this.languageService.getLangValue(this.appLangValue.ua, this.appLangValue.en);
    const value = `${this.prefix ?? ''}${langValue}${this.suffix ?? ''}`;

    if (this.appLangValueType === 'text') {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', value);
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.sanitizer.sanitize(SecurityContext.HTML, value));
    }
  }
}
