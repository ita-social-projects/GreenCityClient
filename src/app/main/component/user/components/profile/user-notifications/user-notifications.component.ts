import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  currentLang: string;
  projects = [];
  notifications = [];

  constructor(
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }
}
