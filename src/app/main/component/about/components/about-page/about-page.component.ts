import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { VisionCard } from '../../models/vision-card.interface';
import { visionCards } from '../constants/vision-cards.const';
import { MetaService } from 'src/app/shared/services/meta/meta.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit, OnDestroy {
  langChangeSub: Subscription;
  private userId: number;
  visionCards: VisionCard[] = visionCards;

  constructor(
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    private readonly translate: TranslateService,
    private readonly metaService: MetaService
  ) {}

  ngOnInit() {
    this.metaService.setMeta('about');
    this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId));
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }

  navigateToHabit(): void {
    this.router.navigate(['profile', this.userId]);
  }

  generateVisionCardClass(idx: number) {
    return `vision-card vision-card__${idx + 1}`;
  }

  ngOnDestroy(): void {
    this.metaService.resetMeta();
    this.langChangeSub.unsubscribe();
  }
}
