import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private langChangeSub: Subscription;
  public userInfo: EditProfileModel;
  public isDesktopWidth: boolean;
  public screenBreakpoint = 1024;

  constructor(
    private announcer: LiveAnnouncer,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private profileService: ProfileService) { }

  ngOnInit() {
    window.innerWidth > this.screenBreakpoint ? this.isDesktopWidth = true : this.isDesktopWidth = false;
    this.announce();
    this.showUserInfo();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  @HostListener('window:resize') public checkDisplayWidth() {
    const windowWidth = window.innerWidth;
    windowWidth > this.screenBreakpoint ? this.isDesktopWidth = true : this.isDesktopWidth = false;
  }

  public announce() {
    this.announcer.announce('Success, logging you in', 'assertive');
  }

  public showUserInfo(): void {
    this.profileService.getUserInfo().subscribe(item => {
      this.userInfo = item;
    });
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject
      .subscribe((lang) => this.bindLang(lang));
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
