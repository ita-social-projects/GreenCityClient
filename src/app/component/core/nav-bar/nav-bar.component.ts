import {Component, OnInit} from '@angular/core';
import {ModalService} from '../_modal/modal.service';
import {MatDialog} from '@angular/material';
import {FavoritePlaceComponent} from '../../map/favorite-place/favorite-place.component';
import {ProposeCafeComponent} from '../propose-cafe/propose-cafe.component';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {UserSettingComponent} from '../../user/user-setting/user-setting.component';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../service/localstorage/local-storage.service';
import {JwtService} from '../../../service/jwt/jwt.service';
import {UserService} from 'src/app/service/user/user.service';
import {AchievementService} from 'src/app/service/achievement/achievement.service';
import {HabitStatisticService} from 'src/app/service/habit-statistic/habit-statistic.service';
import {filter} from 'rxjs/operators';
import {LanguageService} from '../../../i18n/language.service';
import {Language} from '../../../i18n/Language';
import { NewSignUpComponent } from '../../auth/new-sign-up/new-sign-up.component';
import { SignInNewComponent } from '../../auth/sign-in-new/sign-in-new.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  readonly notificationIcon = 'assets/img/notification-icon.png';
  readonly userAvatar = 'assets/img/user-avatar.png';
  readonly arrow = 'assets/img/arrow.png';
  dropdownVisible: boolean;
  firstName: string;
  userRole: string;
  userId: number;
  isLoggedIn: boolean;
  language: string;

  constructor(
    private modalService: ModalService,
    public dialog: MatDialog,
    private favoritePlaceService: FavoritePlaceService,
    private localStorageService: LocalStorageService,
    private jwtService: JwtService,
    private router: Router,
    private userService: UserService,
    private achievementService: AchievementService,
    private habitStatisticService: HabitStatisticService,
    private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.dropdownVisible = false;
    this.localStorageService.firstNameBehaviourSubject.subscribe(firstName => this.firstName = firstName);
    this.localStorageService.userIdBehaviourSubject
      .pipe(
        filter(userId => userId !== null && !isNaN(userId))
      )
      .subscribe(userId => {
        this.userId = userId;
        this.isLoggedIn = true;
      });
    this.userRole = this.jwtService.getUserRole();
    this.language = this.languageService.getCurrentLanguage();
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  openDialog(): void {
    this.dropdownVisible = false;
    const dialogRef = this.dialog.open(FavoritePlaceComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.favoritePlaceService.getFavoritePlaces();
    });
  }

  openSettingDialog(): void {
    this.dropdownVisible = false;
    const dialogRef = this.dialog.open(UserSettingComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openDialogProposeCafeComponent(): void {
    this.dropdownVisible = false;
    const dialogRef = this.dialog.open(ProposeCafeComponent, {
      width: '800px',
      data: 5
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private signOut() {
    this.dropdownVisible = false;
    this.isLoggedIn = false;
    this.localStorageService.clear();
    this.userService.onLogout();
    this.habitStatisticService.onLogout();
    this.achievementService.onLogout();
    this.router.navigateByUrl('/welcome').then(r => r);
  }

  public changeCurrentLanguage() {
    this.languageService.changeCurrentLanguage(this.language as Language);
  }

  private openSignUpWindow(): void {
    this.dialog.open(NewSignUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });
  }

  private openSingInWindow(): void {
    this.dialog.open(SignInNewComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
  }
}
