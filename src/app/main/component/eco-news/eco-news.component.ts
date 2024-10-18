import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../../service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/shared/services/meta/meta.service';

@Component({
  selector: 'app-eco-news',
  templateUrl: './eco-news.component.html',
  styleUrls: ['./eco-news.component.scss']
})
export class EcoNewsComponent implements OnInit, OnDestroy {
  private langChangeSub: Subscription;

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly translate: TranslateService,
    private readonly metaService: MetaService
  ) {}

  ngOnInit() {
    this.metaService.setMeta('news');
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }

    this.metaService.resetMeta();
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }
}
