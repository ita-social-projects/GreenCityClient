import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../../../core/components/propose-cafe/_modal/modal.service';
import { MatDialog } from '@angular/material';
import { UserSettingComponent } from '../../../user/components/user-setting/user-setting.component';
import {NavigationStart, Router} from '@angular/router';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { JwtService } from '../../../../service/jwt/jwt.service';
import { UserService } from 'src/app/service/user/user.service';
import { AchievementService } from 'src/app/service/achievement/achievement.service';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../../../../i18n/language.service';
import { Language } from '../../../../i18n/Language';
import { SearchService } from '../../../../service/search/search.service';
import { UserOwnAuthService } from '../../../../service/auth/user-own-auth.service';
import { SignInComponent } from '../../../auth/components/sign-in/sign-in.component';
import { SignUpComponent } from '../../../auth/components/sign-up/sign-up.component';
import { UiActionsService } from '@global-service/ui-actions/ui-actions.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  readonly selectLanguageArrow = 'assets/img/arrow_grey.png';
  readonly dropDownArrow = 'assets/img/arrow.png';
  private dropdownVisible: boolean;
  private langDropdownVisible: boolean;
  private name: string;
  private userRole: string;
  private userId: number;
  private isLoggedIn: boolean;
  private language: string;
  private isSearchClicked = false;
  private isAllSearchOpen = false;
  private toggleBurgerMenu = false;

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
    this.searchSearch.searchSubject.subscribe(this.openSearchSubscription.bind(this));
    this.searchSearch.allSearchSubject.subscribe(this.openAllSearchSubscription.bind(this));
    this.dropdownVisible = false;
    this.localStorageService.firstNameBehaviourSubject.subscribe(firstName => {
      this.name = firstName;
    });
    this.initUser();
    this.userRole = this.jwtService.getUserRole();
    this.language = this.languageService.getCurrentLanguage();
    this.autoOffBurgerBtn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .pipe(filter(userId => userId !== null && !isNaN(userId)))
      .subscribe(this.assignData.bind(this));
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

  public assignData(userId: number): void {
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

  private toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  private toggleLangDropdown(): void {
    this.langDropdownVisible = !this.langDropdownVisible;
  }

  private autoCloseUserDropDown(event): void {
    this.dropdownVisible = event;
  }

  private onToggleBurgerMenu(): void {
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
    this.uiActionsService.stopScrollingSubject.next(this.toggleBurgerMenu);
  }

  private openSingInWindow(): void {
    this.dialog.open(SignInComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }

  private openSignUpWindow(): void {
    this.dialog.open(SignUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }

  private openDialog(): void {
    this.dropdownVisible = false;
    this.router.navigate(['/profile/{userId}']);
  }

  private openSettingDialog(): void {
    this.dropdownVisible = false;
    const dialogRef = this.dialog.open(UserSettingComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  private signOut(): void {
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
