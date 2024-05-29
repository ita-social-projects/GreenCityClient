import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';
import { take } from 'rxjs/operators';

@Pipe({
  name: 'dateLocalisation',
  pure: false
})
export class DateLocalisationPipe implements PipeTransform {
  private locale: string = this.localStorageService.getCurrentLanguage();

  constructor(private localStorageService: LocalStorageService) {
    this.locale = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(take(1)).subscribe((lang) => (this.locale = lang));
  }

  transform(date: string | Date): string {
    date = !date ? Date.now().toString() : date;
    return formatDate(date, 'mediumDate', this.locale);
  }
}
