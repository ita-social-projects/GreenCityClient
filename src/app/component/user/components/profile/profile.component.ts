import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private langChangeSub: Subscription;

  constructor(private localStorageService: LocalStorageService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject
      .subscribe(this.bindLang.bind(this));
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
