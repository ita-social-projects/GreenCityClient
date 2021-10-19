import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from '../../main/i18n/Language';
import { headerIcons, ubsHeaderIcons } from '../../main/image-pathes/header-icons';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { JwtService } from '@global-service/jwt/jwt.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserService } from '@global-service/user/user.service';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { HabitStatisticService } from '@global-service/habit-statistic/habit-statistic.service';
import { SearchService } from '@global-service/search/search.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { LanguageModel } from '../../main/component/layout/components/models/languageModel';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { environment } from '@environment/environment';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '@global-service/header/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public dropdownVisible = false;
  public langDropdownVisible = false;
  public name: string;
  public isLoggedIn: boolean;
  public isAdmin: boolean;
  public managementLink: string;
  public isAllSearchOpen = false;
  public toggleBurgerMenu = false;
  public arrayLang: Array<LanguageModel>;
  public ariaStatus = 'profile options collapsed';
  public isSearchClicked = false;
  private adminRoleValue = 'ROLE_ADMIN';
  private userRole: string;
  private userId: number;
  private backEndLink = environment.backendLink;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  public headerImageList;
  @ViewChild('signinref') signinref: ElementRef;
  @ViewChild('signupref') signupref: ElementRef;
  public elementName;
  public isUBS: boolean;
  ubsUrl = 'ubs';
  public imageLogo;
  public navLinks;
  public selectedIndex: number = null;
  public currentLanguage: string;

  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private headerService: HeaderService,
    private jwtService: JwtService,
    private router: Router,
    private userService: UserService,
    private achievementService: AchievementService,
    private habitStatisticService: HabitStatisticService,
    private languageService: LanguageService,
    private searchSearch: SearchService,
    private userOwnAuthService: UserOwnAuthService
  ) {}

  ngOnInit() {
    this.isUBS = this.router.url.includes(this.ubsUrl);
    this.localStorageService.setUbsRegistration(this.isUBS);
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.toggleHeader();
    this.setLangArr();
    this.updateArrayLang();
    this.dialog.afterAllClosed.pipe(takeUntil(this.destroySub)).subscribe(() => {
      this.focusDone();
    });

    this.searchSearch.searchSubject.pipe(takeUntil(this.destroySub)).subscribe((signal) => this.openSearchSubscription(signal));

    this.searchSearch.allSearchSubject.pipe(takeUntil(this.destroySub)).subscribe((signal) => this.openAllSearchSubscription(signal));

    this.localStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.name = firstName;
    });

    this.initUser();
    this.jwtService.userRole$.pipe(takeUntil(this.destroySub)).subscribe((userRole) => {
      this.userRole = userRole;
      this.isAdmin = this.userRole === this.adminRoleValue;
    });
    this.autoOffBurgerBtn();
    this.userOwnAuthService.getDataFromLocalStorage();

    this.userOwnAuthService.isLoginUserSubject.pipe(takeUntil(this.destroySub)).subscribe((status) => (this.isLoggedIn = status));

    this.localStorageService.accessTokenBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((token) => {
      this.managementLink = `${this.backEndLink}token?accessToken=${token}`;
    });
  }

  public focusDone(): void {
    if (this.elementName === 'sign-up' && !this.isLoggedIn) {
      this.signupref.nativeElement.focus();
    }
    if (this.elementName === 'sign-in' && !this.isLoggedIn) {
      this.signinref.nativeElement.focus();
    }
  }

  public navigateToLink(link, index) {
    this.headerService.setSelectedIndex(index);
    if (link.url) {
      window.open(link.route);
    } else {
      this.router.navigate([link.route]);
    }
    if (link.route === '/') {
      this.headerService.setSelectedIndex(null);
    }
  }

  toggleHeader(): void {
    this.selectedIndex = this.headerService.getSelectedIndex();
    this.navLinks = this.headerService.getNavLinks(this.isUBS);
    this.headerImageList = this.isUBS ? ubsHeaderIcons : headerIcons;
    this.imageLogo = this.isUBS ? ubsHeaderIcons.ubsAdminLogo : headerIcons.greenCityLogo;
  }

  ngOnDestroy() {
    this.destroySub.next(true);
    this.destroySub.unsubscribe();
  }

  private updateArrayLang() {
    this.arrayLang = [];
    this.arrayLang = this.headerService.getArrayLang(this.isUBS);
  }

  private setLangArr(): void {
    this.updateArrayLang();
    let mainLang = null;
    if (this.isUBS && this.currentLanguage === Language.RU) {
      this.languageService.changeCurrentLanguage(Language.UA.toLowerCase() as Language);
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
    }
    this.arrayLang.forEach((item, i, arr) => {
      if (arr[i].lang.toLowerCase() === this.currentLanguage) {
        mainLang = item;
        arr.splice(i, 1);
        arr.unshift(mainLang);
        mainLang = null;
      }
    });
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .pipe(
        takeUntil(this.destroySub),
        filter((userId) => userId !== null && !isNaN(userId))
      )
      .subscribe((userId) => this.assignData(userId));
  }

  public changeCurrentLanguage(language, index: number): void {
    this.languageService.changeCurrentLanguage(language.toLowerCase() as Language);
    const temporary = this.arrayLang[0].lang;
    this.arrayLang[0].lang = language;
    this.arrayLang[index].lang = temporary;
    this.langDropdownVisible = false;
    const currIndex = this.languageService.getLanguageId(language.toLowerCase() as Language);
    if (this.isLoggedIn) {
      this.userService.updateUserLanguage(currIndex).subscribe();
    }
  }

  public getUserId(): number | string {
    if (this.userId !== null && !isNaN(this.userId)) {
      return this.userId;
    }
    return 'not_signed_in';
  }

  private autoOffBurgerBtn(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroySub),
        filter((events) => events instanceof NavigationStart)
      )
      .subscribe(() => {
        this.toggleBurgerMenu = false;
        this.toggleScroll();
      });
  }

  private assignData(userId: number): void {
    this.userId = userId;
    this.userOwnAuthService.isLoginUserSubject.next(true);
  }

  public toggleSearchPage(): void {
    this.searchSearch.toggleSearchModal();
  }

  private openSearchSubscription(signal: boolean): void {
    this.isSearchClicked = signal;
  }

  private openAllSearchSubscription(signal: boolean): void {
    this.isAllSearchOpen = signal;
  }

  public toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
    this.ariaStatus = this.dropdownVisible ? 'profile options expanded' : 'profile options collapsed';
  }

  public autoCloseUserDropDown(event): void {
    this.dropdownVisible = event;
    this.ariaStatus = 'profile options collapsed';
  }

  public autoCloseLangDropDown(event): void {
    this.langDropdownVisible = event;
  }

  public onToggleBurgerMenu(): void {
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
    this.toggleScroll();
  }

  public openAuthModalWindow(page: string): void {
    this.elementName = page;
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: page
      }
    });
  }

  public openSettingDialog(): void {
    this.dropdownVisible = false;
    this.router.navigate(['/profile', this.userId, 'edit']);
  }

  public signOut(): void {
    this.dropdownVisible = false;
    this.userOwnAuthService.isLoginUserSubject.next(false);
    this.localStorageService.clear();
    this.habitStatisticService.onLogout();
    this.achievementService.onLogout();
    this.router.navigateByUrl('/').then((r) => r);
    this.userOwnAuthService.getDataFromLocalStorage();
    this.jwtService.userRole$.next('');
  }

  public toggleScroll(): void {
    this.toggleBurgerMenu ? document.body.classList.add('modal-open') : document.body.classList.remove('modal-open');
  }
}
