import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { JwtService } from '@global-service/jwt/jwt.service';
import { ModalService } from '@global-core/components/propose-cafe/_modal/modal.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserService } from 'src/app/service/user/user.service';
import { AchievementService } from 'src/app/service/achievement/achievement.service';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { LanguageService } from '@language-service/language.service';
import { Language } from '@language-service/Language';
import { SearchService } from '@global-service/search/search.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { LanguageModel } from '../models/languageModel';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  readonly selectLanguageArrow = 'assets/img/arrow_grey.png';
  readonly dropDownArrow = 'assets/img/arrow.png';
  public dropdownVisible: boolean;
  public langDropdownVisible: boolean;
  public name: string;
  public isLoggedIn: boolean;
  public isAllSearchOpen = false;
  public toggleBurgerMenu = false;
  public arrayLang: Array<LanguageModel> = [
    {lang: 'Uk'},
    {lang: 'En'},
    {lang: 'Ru'}];
  public isSearchClicked = false;
  private userRole: string;
  private userId: number;

  constructor(private modalService: ModalService,
              public dialog: MatDialog,
              private localStorageService: LocalStorageService,
              private jwtService: JwtService,
              private router: Router,
              private userService: UserService,
              private achievementService: AchievementService,
              private habitStatisticService: HabitStatisticService,
              private languageService: LanguageService,
              private searchSearch: SearchService,
              private userOwnAuthService: UserOwnAuthService,
  ) {}

  ngOnInit() {
    this.searchSearch.searchSubject.subscribe(signal => this.openSearchSubscription(signal));
    this.searchSearch.allSearchSubject.subscribe(signal => this.openAllSearchSubscription(signal));
    this.dropdownVisible = false;
    this.localStorageService.firstNameBehaviourSubject.subscribe(firstName => { this.name = firstName; });
    this.langDropdownVisible = false;
    this.initUser();
    this.setLangArr();
    this.userRole = this.jwtService.getUserRole();
    this.autoOffBurgerBtn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  setLangArr(): void {
    const language = this.languageService.getCurrentLanguage();
    const currentLangObj = { lang: language.charAt(0).toUpperCase() + language.slice(1) };
    const currentLangIndex = this.arrayLang.findIndex(lang => lang.lang === currentLangObj.lang);
    this.arrayLang = [
      currentLangObj,
      ...this.arrayLang.slice(0, currentLangIndex),
      ...this.arrayLang.slice(currentLangIndex + 1)
    ];
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .pipe(filter(userId => userId !== null && !isNaN(userId)))
      .subscribe(userId => this.assignData(userId));
  }

  public changeCurrentLanguage(language, index: number): void {
    this.languageService.changeCurrentLanguage(language.toLowerCase() as Language);
    const temporary = this.arrayLang[0].lang;
    this.arrayLang[0].lang = language;
    this.arrayLang[index].lang = temporary;
    this.langDropdownVisible = false;
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
        filter((events) => events instanceof NavigationStart)
      )
      .subscribe(() => {
        this.toggleBurgerMenu = false;
        this.toggleScroll();
      });
  }

  private assignData(userId: number): void {
    this.userId = userId;
    this.isLoggedIn = true;
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
  }

  public autoCloseUserDropDown(event): void {
    this.dropdownVisible = event;
  }

  public autoCloseLangDropDown(event): void {
    this.langDropdownVisible = event;
  }

  public onToggleBurgerMenu(): void {
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
    this.toggleScroll();
  }

  public openSingInWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container', 'transparent'],
      data: {
        popUpName: 'sign-in'
      }
    });
  }

  public openSignUpWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container', 'transparent'],
      data: {
        popUpName: 'sign-up'
      }
    });
  }

  public openAuthModalWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container', 'transparent']
    });
  }

  public openDialog(): void {
    this.dropdownVisible = false;
    this.router.navigate(['/profile', this.userId]);
  }

  public openSettingDialog(): void {
    this.dropdownVisible = false;
    this.router.navigate(['/profile', this.userId, 'edit']);
  }

  public signOut(): void {
    this.dropdownVisible = false;
    this.isLoggedIn = false;
    this.localStorageService.clear();
    this.userService.onLogout();
    this.habitStatisticService.onLogout();
    this.achievementService.onLogout();
    this.router.navigateByUrl('/welcome').then(r => r);
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  public toggleScroll(): void {
    this.toggleBurgerMenu ?
    document.body.classList.add('modal-open') :
    document.body.classList.remove('modal-open');
  }
}
