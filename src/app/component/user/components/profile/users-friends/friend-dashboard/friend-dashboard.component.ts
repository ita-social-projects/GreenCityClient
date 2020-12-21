import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friend-dashboard',
  templateUrl: './friend-dashboard.component.html',
  styleUrls: ['./friend-dashboard.component.scss']
})
export class FriendDashboardComponent implements OnInit {
  public userId: number;
  private langChangeSub: Subscription;
  constructor(private localStorageService: LocalStorageService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.initUser();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe((userId: number) => this.userId = userId);
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
