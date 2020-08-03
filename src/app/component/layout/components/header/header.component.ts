import { Component, OnInit } from '@angular/core';
import { ModalService } from '@global-core/components/propose-cafe/_modal/modal.service';
import { MatDialog } from '@angular/material';
import { UserSettingComponent } from '@global-user/components/user-setting/user-setting.component';
import { NavigationStart, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserService } from 'src/app/service/user/user.service';
import { AchievementService } from 'src/app/service/achievement/achievement.service';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { filter } from 'rxjs/operators';
import { LanguageService } from '@language-service/language.service';
import { Language } from '@language-service/Language';
import { SearchService } from '@global-service/search/search.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { SignInComponent } from '@global-auth/index';
import { SignUpComponent } from '@global-auth/index';
import { UiActionsService } from '@global-service/ui-actions/ui-actions.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public selectLanguageArrow = 'assets/img/arrow_grey.png';
  public dropDownArrow = 'assets/img/arrow.png';
  public dropdownVisible: boolean;
  public langDropdownVisible: boolean;
  public name: string;
  public isLoggedIn: boolean;
  public isAllSearchOpen = false;
  public toggleBurgerMenu = false;
  private userRole: string;
  private userId: number;
  private language: string;
  private isSearchClicked = false;


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
              private uiActionsService: UiActionsService,
  ) {}

  ngOnInit() {
    this.searchSearch.searchSubject.subscribe(signal => this.openSearchSubscription(signal));
    this.searchSearch.allSearchSubject.subscribe(signal => this.openAllSearchSubscription(signal));
    this.dropdownVisible = false;
    this.localStorageService.firstNameBehaviourSubject.subscribe(firstName => { this.name = firstName; });
    this.initUser();
    this.userRole = this.jwtService.getUserRole();
    this.language = this.languageService.getCurrentLanguage();
    this.autoOffBurgerBtn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .pipe(filter(userId => userId !== null && !isNaN(userId)))
      .subscribe(userId => this.assignData(userId));
  }

  public changeCurrentLanguage(): void {
    this.languageService.changeCurrentLanguage(this.language as Language);
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
      });
  }

  private assignData(userId: number): void {
    this.userId = userId;
    this.isLoggedIn = true;
  }

  private toggleSearchPage(): void {
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

  public toggleLangDropdown(): void {
    this.langDropdownVisible = !this.langDropdownVisible;
    this.dropdownVisible = false;
  }

  public onToggleBurgerMenu(): void {
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
    this.uiActionsService.stopScrollingSubject.next(this.toggleBurgerMenu);
  }

  public openSingInWindow(): void {
    this.dialog.open(SignInComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }

  public openSignUpWindow(): void {
    this.dialog.open(SignUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }

  public openDialog(): void {
    this.dropdownVisible = false;
    this.router.navigate(['/profile/{userId}']);
  }

  public openSettingDialog(): void {
    this.dropdownVisible = false;
    const dialogRef = this.dialog.open(UserSettingComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
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
}
