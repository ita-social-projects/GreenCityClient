import { footerIcons } from 'src/app/greencity/image-paths/footer-icons';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  actualYear = new Date().getFullYear();
  footerImageList = footerIcons;
  private userId: number;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  private langChangeSub: Subscription;

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((userId) => (this.userId = userId));

    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }
  getUserId(): number | string {
    return this.userId !== null && !isNaN(this.userId) ? this.userId : 'not_signed-in';
  }

  ngOnDestroy() {
    this.destroySub.next(true);
    this.destroySub.complete();
  }

  ubsSetRegValue() {
    this.localStorageService.setUbsRegistration(false);
  }
}
