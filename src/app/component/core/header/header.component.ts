import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from '../_modal/modal.service';
import { MatDialog } from '@angular/material';
import { FavoritePlaceComponent } from '../../map/favorite-place/favorite-place.component';
import { FavoritePlaceService } from '../../../service/favorite-place/favorite-place.service';
import { UserSettingComponent } from '../../user/user-setting/user-setting.component';
import {NavigationStart, Router} from '@angular/router';
import { LocalStorageService } from '../../../service/localstorage/local-storage.service';
import { JwtService } from '../../../service/jwt/jwt.service';
import { UserService } from 'src/app/service/user/user.service';
import { AchievementService } from 'src/app/service/achievement/achievement.service';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../../../i18n/language.service';
import { Language } from '../../../i18n/Language';
import { SearchService } from '../../../service/search/search.service';
import { SignInNewComponent } from '../../auth/sign-in-new/sign-in-new.component';
import { NewSignUpComponent } from '../../auth/new-sign-up/new-sign-up.component';
import { UserOwnAuthService } from '../../../service/auth/user-own-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  readonly selectLanguageArrow = 'assets/img/arrow_grey.png';
  readonly dropDownArrow = 'assets/img/arrow.png';
  private dropdownVisible: boolean;
  private name: string;
  private userRole: string;
  private userId: number;
  private isLoggedIn: boolean;
  private language: string;
  private isSearchClicked = false;
  private onToggleBurgerMenu = false;

  constructor(private modalService: ModalService,
              public dialog: MatDialog,
              private favoritePlaceService: FavoritePlaceService,
              private localStorageService: LocalStorageService,
              private jwtService: JwtService,
              private router: Router,
              private userService: UserService,
              private achievementService: AchievementService,
              private habitStatisticService: HabitStatisticService,
              private languageService: LanguageService,
              private searchSearch: SearchService,
              private userOwnAuthService: UserOwnAuthService) {}

  ngOnInit() {
    this.searchSearch.searchSubject.subscribe(this.openSearchSubscription.bind(this));
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
        this.onToggleBurgerMenu = false;
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

  private toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  private openSingInWindow(): void {
    this.dialog.open(SignInNewComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }

  private openSignUpWindow(): void {
    this.dialog.open(NewSignUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }

  private openDialog(): void {
    this.dropdownVisible = false;
    const dialogRef = this.dialog.open(FavoritePlaceComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.favoritePlaceService.getFavoritePlaces();
    });
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
