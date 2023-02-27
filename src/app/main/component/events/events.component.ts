import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  private langChangeSub: Subscription;
  constructor(private translate: TranslateService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.subscribeToLangChange();
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }
}
