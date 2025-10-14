import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateLocalisation',
  pure: false
})
export class DateLocalisationPipe implements PipeTransform, OnDestroy {
  private locale: string;
  private destroy$: Subject<void> = new Subject();

  constructor(
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {
    this.locale = this.translate.getDefaultLang() || 'en-US';
    this.translate.onDefaultLangChange.pipe(takeUntil(this.destroy$)).subscribe((langObj) => (this.locale = langObj.lang));
  }

  transform(value: any, format = 'mediumDate'): string {
    const locale = this.locale === 'en' ? 'en-US' : 'uk-UA';
    return this.datePipe.transform(value, format, undefined, locale);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
