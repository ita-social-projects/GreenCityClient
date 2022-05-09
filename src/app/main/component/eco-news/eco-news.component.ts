import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-eco-news',
  templateUrl: './eco-news.component.html',
  styleUrls: ['./eco-news.component.scss']
})
export class EcoNewsComponent implements OnInit {
  private langChangeSub: Subscription;

  constructor(private localStorageService: LocalStorageService, private translate: TranslateService) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }
}
