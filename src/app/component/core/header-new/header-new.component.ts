import { Component, OnInit } from '@angular/core';
import { ModalService } from '../_modal/modal.service';
import { MatDialog } from '@angular/material';
import { FavoritePlaceComponent } from '../../map/favorite-place/favorite-place.component';
import { ProposeCafeComponent } from '../propose-cafe/propose-cafe.component';
import { FavoritePlaceService } from '../../../service/favorite-place/favorite-place.service';
import { UserSettingComponent } from '../../user/user-setting/user-setting.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../service/localstorage/local-storage.service';
import { JwtService } from '../../../service/jwt/jwt.service';
import { UserService } from 'src/app/service/user/user.service';
import { AchievementService } from 'src/app/service/achievement/achievement.service';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../../../i18n/language.service';
import { Language } from '../../../i18n/Language';

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.scss']
})
export class HeaderNewComponent implements OnInit {
  readonly notificationIcon = 'assets/img/notification-icon.png';
  readonly userAvatar = 'assets/img/user-avatar.png';
  readonly arrow = 'assets/img/arrow_grey.png';
  private dropdownVisible: boolean;
  private firstName: string;
  private userRole: string;
  private userId: number;
  private isLoggedIn: boolean;
  private language: string;

  constructor(private modalService: ModalService,
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

  ngOnInit() {
    this.dropdownVisible = false;
    this.localStorageService.firstNameBehaviourSubject.subscribe(firstName => this.firstName = firstName);
    this.localStorageService.userIdBehaviourSubject
      .pipe(
        filter(userId => userId !== null && !isNaN(userId))
      )
      .subscribe(this.assignData.bind(this));
    this.userRole = this.jwtService.getUserRole();
    this.language = this.languageService.getCurrentLanguage();
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

  public assignData(userId: number): void {
    this.userId = userId;
    this.isLoggedIn = true;
  }
}
