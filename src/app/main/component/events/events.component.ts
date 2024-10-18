import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/shared/services/meta/meta.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  constructor(
    private readonly translate: TranslateService,
    private readonly localStorageService: LocalStorageService,
    private readonly metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.metaService.setMeta('events');
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.subscribeToLangChange();
  }

  ngOnDestroy() {
    this.metaService.resetMeta();
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }
}
