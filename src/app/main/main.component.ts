import { TitleAndMetaTagsService } from './service/title-meta-tags/title-and-meta-tags.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '@global-service/user/user.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isUBS: boolean;
  isUnsubscribe: boolean;
  ubsUrl = 'ubs';
  unsubscribeUrl = 'unsubscribe';
  isLogin: boolean;

  constructor(
    private titleAndMetaTagsService: TitleAndMetaTagsService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private userOwnAuthService: UserOwnAuthService
  ) {}

  @ViewChild('focusFirst', { static: true }) focusFirst: ElementRef;
  @ViewChild('focusLast', { static: true }) focusLast: ElementRef;

  ngOnInit() {
    this.isUBS = this.router.url.includes(this.ubsUrl);
    this.isUnsubscribe = this.router.url.includes(this.unsubscribeUrl);
    this.localStorageService.setUbsRegistration(this.isUBS);
    this.navigateToStartingPositionOnPage();
    this.titleAndMetaTagsService.useTitleMetasData();
    this.checkLogin();
  }

  @HostListener('window:beforeunload')
  onExitHandler() {
    this.userService.updateLastTimeActivity();
  }

  setFocus(): void {
    this.focusFirst.nativeElement.focus();
  }

  skipFocus(): void {
    this.focusLast.nativeElement.focus();
  }

  private navigateToStartingPositionOnPage(): void {
    this.router.events.subscribe((navigationEvent) => {
      if (navigationEvent instanceof NavigationEnd) {
        window.scroll(0, 0);
      }

      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
  }

  private checkLogin() {
    this.userOwnAuthService.isLoginUserSubject.subscribe((status) => {
      this.isLogin = status;
    });
  }
}
