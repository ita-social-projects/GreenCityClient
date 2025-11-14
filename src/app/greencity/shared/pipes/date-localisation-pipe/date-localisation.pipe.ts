import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateLocalisation',
  standalone: true,
  pure: false
})
export class DateLocalisationPipe implements PipeTransform, OnDestroy {
  private locale: string;
  private readonly destroy$: Subject<void> = new Subject();

  constructor(
    private readonly translate: TranslateService,
    private readonly datePipe: DatePipe,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.locale = this.translate.getDefaultLang() || 'en';
    this.translate.onDefaultLangChange.pipe(takeUntil(this.destroy$)).subscribe((langObj) => {
      this.locale = langObj.lang;
      this.cdr.markForCheck();
    });
  }

  transform(value: any, format = 'mediumDate'): string {
    return this.datePipe.transform(value, format, undefined, this.locale);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
