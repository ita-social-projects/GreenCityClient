import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public currLang: string;
  private langChangeSub: Subscription;
  public userInfo: EditProfileModel;
  public isDesktopWidth: boolean;
  public screenBreakpoint = 1023;
  public progress: ProfileStatistics;

  constructor(
    private announcer: LiveAnnouncer,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.localStorageService.setCurentPage('previousPage', '/profile');
    this.isDesktopWidth = this.isDeskWidth();
    this.announce();
    this.showUserInfo();
    this.subscribeToLangChange();
    this.checkUserActivities();
  }

  @HostListener('window:resize') public checkDisplayWidth() {
    this.isDesktopWidth = this.isDeskWidth();
  }

  public isDeskWidth() {
    return window.innerWidth > this.screenBreakpoint;
  }

  public announce() {
    this.announcer.announce('Success, logging you in', 'assertive');
  }

  public showUserInfo(): void {
    this.profileService.getUserInfo().subscribe((item) => {
      this.userInfo = item;
    });
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe((lang) => {
      lang = lang ?? this.localStorageService.getCurrentLanguage();
      this.currLang = lang;
      this.bindLang(lang);
    });
  }

  private checkUserActivities(): void {
    this.profileService
      .getUserProfileStatistics()
      .pipe(take(1))
      .subscribe((statistics: ProfileStatistics) => {
        this.progress = statistics;
      });
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
}
