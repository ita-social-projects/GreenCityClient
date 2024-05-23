import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'dateLocalisation',
  pure: false
})
export class DateLocalisationPipe implements PipeTransform, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private locale: string = this.localStorageService.getCurrentLanguage();

  constructor(private localStorageService: LocalStorageService) {
    this.locale = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => (this.locale = lang));
  }

  transform(date: string | Date): string {
    date = !date ? Date.now().toString() : date;
    return formatDate(date, 'mediumDate', this.locale);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
