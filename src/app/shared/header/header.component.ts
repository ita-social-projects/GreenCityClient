import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from '../../main/i18n/Language';
import { headerIcons, ubsHeaderIcons } from '../../main/image-pathes/header-icons';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Injector } from '@angular/core';
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
import { OrderService } from 'src/app/ubs/ubs/services/order.service';

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
  public isGreenCityAdmin: boolean;
  public managementLink: string;
  public isAllSearchOpen = false;
  public toggleBurgerMenu = false;
  public arrayLang: Array<LanguageModel>;
  public ariaStatus = 'profile options collapsed';
  public isSearchClicked = false;
  private adminRoleValue = 'ROLE_UBS_EMPLOYEE';
  private adminRoleGreenCityValue = 'ROLE_ADMIN';
  private userRole: string;
  private userId: number;
  private backEndLink = environment.backendLink;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  public headerImageList;
  @ViewChild('signinref') signinref: ElementRef;
  @ViewChild('signupref') signupref: ElementRef;
  public elementName;
  public isUBS: boolean;
  public ubsUrl = 'ubs';
  public imageLogo;
  public navLinks;
  public selectedIndex: number = null;
  public currentLanguage: string;
  public dialog: MatDialog;
  public imgAlt: string;
  private localeStorageService: LocalStorageService;
  private jwtService: JwtService;
  private router: Router;
  private userService: UserService;
  private achievementService: AchievementService;
  private habitStatisticService: HabitStatisticService;
  private languageService: LanguageService;
  private searchSearch: SearchService;
  private userOwnAuthService: UserOwnAuthService;
  private headerService: HeaderService;
  private orderService: OrderService;

  constructor(private injector: Injector) {
    this.dialog = injector.get(MatDialog);
    this.localeStorageService = injector.get(LocalStorageService);
    this.jwtService = injector.get(JwtService);
    this.router = injector.get(Router);
    this.userService = injector.get(UserService);
    this.achievementService = injector.get(AchievementService);
    this.habitStatisticService = injector.get(HabitStatisticService);
    this.languageService = injector.get(LanguageService);
    this.searchSearch = injector.get(SearchService);
    this.userOwnAuthService = injector.get(UserOwnAuthService);
    this.headerService = injector.get(HeaderService);
    this.orderService = injector.get(OrderService);
  }

  ngOnInit() {
    this.isUBS = this.router.url.includes(this.ubsUrl);
    this.imgAlt = this.isUBS ? 'Image ubs logo' : 'Image green city logo';
    this.localeStorageService.setUbsRegistration(this.isUBS);
    this.currentLanguage = this.localeStorageService.getCurrentLanguage();
    this.toggleHeader();
    this.setLangArr();
    this.updateArrayLang();
    this.dialog.afterAllClosed.pipe(takeUntil(this.destroySub)).subscribe(() => {
      this.focusDone();
    });

    this.searchSearch.searchSubject.pipe(takeUntil(this.destroySub)).subscribe((signal) => this.openSearchSubscription(signal));

    this.searchSearch.allSearchSubject.pipe(takeUntil(this.destroySub)).subscribe((signal) => this.openAllSearchSubscription(signal));

    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.name = firstName;
    });

    this.initUser();
    this.jwtService.userRole$.pipe(takeUntil(this.destroySub)).subscribe((userRole) => {
      this.userRole = userRole;
      this.isAdmin = this.userRole === this.adminRoleValue;
      this.isGreenCityAdmin = this.userRole === this.adminRoleGreenCityValue;
    });
    this.autoOffBurgerBtn();
    this.userOwnAuthService.getDataFromLocalStorage();

    this.userOwnAuthService.isLoginUserSubject.pipe(takeUntil(this.destroySub)).subscribe((status) => (this.isLoggedIn = status));

    this.localeStorageService.accessTokenBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((token) => {
      this.managementLink = `${this.backEndLink}token?accessToken=${token}`;
    });
  }

  public getRouterLink(): string {
    if (this.isUBS && this.isAdmin) {
      return '/ubs-admin/orders';
    }
    if (this.isUBS && !this.isAdmin) {
      return '/ubs';
    }
    return '/greenCity';
  }

  toggleHeader(): void {
    this.selectedIndex = this.headerService.getSelectedIndex();
    this.navLinks = this.headerService.getNavLinks(this.isUBS);
    this.headerImageList = this.isUBS ? ubsHeaderIcons : headerIcons;
    this.imageLogo = this.isUBS ? ubsHeaderIcons.ubsAdminLogo : headerIcons.greenCityLogo;
  }

  public focusDone(): void {
    if (this.elementName === 'sign-up' && !this.isLoggedIn) {
      this.signupref.nativeElement.focus();
    }
    if (this.elementName === 'sign-in' && !this.isLoggedIn) {
      this.signinref.nativeElement.focus();
    }
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
      this.currentLanguage = this.localeStorageService.getCurrentLanguage();
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
    this.localeStorageService.userIdBehaviourSubject
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
    if (this.isLoggedIn) {
      const curLangId = this.languageService.getLanguageId(language.toLowerCase() as Language);
      this.userService.updateUserLanguage(curLangId);
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
    this.router.navigateByUrl(!this.isUBS ? '/greenCity' : '/').then((isRedirected: boolean) => {
      if (isRedirected) {
        this.userOwnAuthService.isLoginUserSubject.next(false);
        this.localeStorageService.clear();
        this.habitStatisticService.onLogout();
        this.achievementService.onLogout();
        this.orderService.cancelUBSwithoutSaving();
        this.userOwnAuthService.getDataFromLocalStorage();
        this.jwtService.userRole$.next('');
      }
    });
  }

  public toggleScroll(): void {
    this.toggleBurgerMenu ? document.body.classList.add('modal-open') : document.body.classList.remove('modal-open');
  }
}
