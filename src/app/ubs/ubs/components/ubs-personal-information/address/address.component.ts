import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnDestroy {
  @Input() address: any;
  currentLang: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.currentLang = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.currentLang === 'ua' ? uaValue : enValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
