import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const LOCALIZED_VOLUME = {
  en: 'l',
  ua: 'л',
  ru: 'л'
};

@Pipe({
  name: 'volume',
  pure: false
})
export class VolumePipe implements PipeTransform, OnDestroy {
  private lang: string;
  private destroy$: Subject<any> = new Subject();

  constructor(translate: TranslateService, localStorageService: LocalStorageService) {
    this.lang = localStorageService.getCurrentLanguage() || translate.defaultLang;
    translate.onDefaultLangChange.pipe(takeUntil(this.destroy$)).subscribe((defaultLangObj) => {
      this.lang = defaultLangObj.lang;
    });
  }

  transform(value: any): any {
    return `${value}${LOCALIZED_VOLUME[this.lang]}`;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
