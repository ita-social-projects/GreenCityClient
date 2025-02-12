import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { EditProfileModel } from 'src/app/greencity/modules/user/models/edit-profile.model';
import { ProfileStatistics } from 'src/app/greencity/modules/user/models/profile-statistiscs';
import { UserFriendsService } from 'src/app/greencity/modules/user/services/user-friends/user-friends.service';
import { UserDataAsFriend, FriendStatusValues } from 'src/app/greencity/modules/user/models/friend.model';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from 'src/app/greencity/modules/user/services/profile-service/profile.service';
import { ProfilePrivacyPolicy } from 'src/app/greencity/modules/user/models/edit-profile-const';

@Component({
  selector: 'app-friend-profile-page',
  templateUrl: './friend-profile-page.component.html',
  styleUrls: ['./friend-profile-page.component.scss']
})
export class FriendProfilePageComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  profileUserId: number;
  loggedInUserId: number;
  userInfo: EditProfileModel;
  progress: ProfileStatistics;
  showButtons = false;
  userAsFriend: UserDataAsFriend;
  friendStatus = FriendStatusValues;

  constructor(
    private readonly userFriendsService: UserFriendsService,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly localStorageService: LocalStorageService,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    this.translate.setDefaultLang(this.localStorageService.getCurrentLanguage());
    this.bindLang();
    this.profileUserId = this.route.snapshot.params.userId;
    this.userFriendsService
      .getUserDataAsFriend(this.profileUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.userAsFriend = data;
      });
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId) => {
      this.loggedInUserId = userId;
      this.showButtons = this.loggedInUserId !== this.profileUserId;
    });
    this.getUserInfo(this.profileUserId);
    this.getUserActivities();
  }

  private bindLang(): void {
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => this.translate.setDefaultLang(lang));
  }

  private getUserInfo(id: number): void {
    this.userFriendsService
      .getUserInfo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: EditProfileModel) => {
        this.userInfo = data;
      });
  }

  private getUserActivities(): void {
    this.userFriendsService
      .getUserProfileStatistics(this.profileUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.progress = data;
      });
  }

  isContentVisible(privacySetting: ProfilePrivacyPolicy): boolean {
    return this.profileService.isContentVisible(privacySetting, this.loggedInUserId === this.profileUserId, this.userAsFriend);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
