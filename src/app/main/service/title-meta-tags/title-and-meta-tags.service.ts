import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { MetasModel } from '../../model/meta/metas-model';
import { MetaModel } from '../../model/meta/meta-model';

@Injectable({
  providedIn: 'root'
})
export class TitleAndMetaTagsService {
  private titleSubject = new Subject<string>();
  private metasSubject = new Subject<MetasModel>();

  constructor(private titleService: Title, private meta: Meta, private router: Router, private translations: TranslateService) {}

  public useTitleMetasData(): void {
    this.initTitle();
    this.initMetas();
    this.applyingTitleMetasData();
  }

  private initTitle(): void {
    this.router.events
      .pipe(
        filter((events) => events instanceof NavigationEnd),
        map((events) => (events as any).url.slice(1))
      )
      .subscribe((nameTitle: string) => {
        if (nameTitle) {
          this.titleSubject.next(nameTitle.match(/\w+[-]?[a-z]+/).toString());
        }
      });
  }

  private initMetas(): void {
    this.translations.onDefaultLangChange.subscribe((elem) => {
      this.metasSubject.next(elem.translations.metas);
    });
  }

  private applyingTitleMetasData(): void {
    combineLatest([this.titleSubject, this.metasSubject]).subscribe(([title, metas]) => {
      const pages = Object.keys(metas);
      const DEFAULT_STRING = 'welcome';
      const meta = pages.includes(title) ? metas[title] : metas[DEFAULT_STRING];
      this.initTitleAndMeta(meta);
    });
  }

  private initTitleAndMeta(meta: MetaModel): void {
    this.titleService.setTitle(meta.title);
    this.meta.updateTag({ name: 'keywords', content: meta?.keywords || '' });
    this.meta.updateTag({ name: 'description', content: meta?.description || '' });
  }
}
