import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EditProfileModel } from '@global-user/models/edit-profile.model';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { UserDataAsFriend, FriendStatusValues } from '@global-user/models/friend.model';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    private userFriendsService: UserFriendsService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private localStorageService: LocalStorageService
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
