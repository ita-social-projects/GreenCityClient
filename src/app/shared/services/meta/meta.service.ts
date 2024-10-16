import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private currentPageKey: string;

  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta,
    private readonly translate: TranslateService,
    private readonly languageService: LanguageService
  ) {
    this.languageService.getCurrentLangObs().subscribe((lang) => {
      console.log('MetaService language subscription', lang);
      this.translate.use(lang === 'en' ? 'en' : 'ua');

      if (this.currentPageKey) {
        this.setMeta(this.currentPageKey);
      }
    });
  }

  resetMeta(): void {
    this.setMeta();
  }

  setMeta(pageKey?: string): void {
    if (!pageKey) {
      pageKey = 'default';
    }

    this.currentPageKey = pageKey;

    const title$ = this.translate.get(`meta.${pageKey}.title`);
    const description$ = this.translate.get(`meta.${pageKey}.description`);

    forkJoin([title$, description$]).subscribe(([translatedTitle, translatedDescription]) => {
      this.titleService.setTitle(translatedTitle);
      this.metaService.updateTag({ name: 'description', content: translatedDescription });
    });
  }
}
