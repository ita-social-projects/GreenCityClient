import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'filterLocationListByLang',
  pure: false
})
export class FilterLocationListByLangPipe implements PipeTransform, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  private locale: string;

  constructor(private localStorageService: LocalStorageService) {
    this.locale = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => (this.locale = lang));
  }

  transform(list: any): any[] {
    if (!list) {
      return list;
    }
    return list.map((location) => ({
      ...location,
      locationsDtos: [
        {
          ...location.locationsDtos[0],
          locationTranslationDtoList: location.locationsDtos[0].locationTranslationDtoList.filter(
            (item) => item.languageCode === this.locale
          )
        }
      ]
    }));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
