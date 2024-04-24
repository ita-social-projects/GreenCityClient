import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';

@Pipe({
  name: 'dateLocalisation',
  pure: false
})
export class DateLocalisationPipe implements PipeTransform {
  private langChangeSubscription: Subscription;
  private locale: string = this.localStorageService.getCurrentLanguage();

  constructor(private localStorageService: LocalStorageService) {
    this.langChangeSubscription = this.localStorageService.languageSubject.subscribe((lang) => (this.locale = lang));
  }

  transform(date: string | Date): string {
    return formatDate(date, 'mediumDate', `${this.locale}`, null);
  }
}
