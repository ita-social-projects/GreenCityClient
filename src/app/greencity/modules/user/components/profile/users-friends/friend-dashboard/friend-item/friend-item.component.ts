import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendModel, UserDashboardTab, UserDataAsFriend } from 'src/app/greencity/modules/user/models/friend.model';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { UserLocationDto } from 'src/app/greencity/modules/user/models/edit-profile.model';
import { Subject } from 'rxjs';
import { UserOnlineStatusService } from 'src/app/greencity/modules/user/services/user-online-status/user-online-status.service';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {
  private destroy$ = new Subject();
  currentLang: string;
  userId: number;
  currentUserId: number;
  userDataAsFriend: UserDataAsFriend;

  @Input() friend: FriendModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private readonly userOnlineStatusService: UserOnlineStatusService
  ) {
    this.userId = +this.route.snapshot.params.userId;
  }

  ngOnInit() {
    const { id, friendStatus, requesterId, chatId } = this.friend;
    this.userDataAsFriend = { id, friendStatus, requesterId, chatId };
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => {
      this.currentUserId = id;
    });
    this.getLangChange();
  }

  private getLangChange(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  private toUsersInfo(tab = UserDashboardTab.allHabits): void {
    if (this.currentUserId === this.friend.id) {
      this.router.navigate(['profile', this.currentUserId], {
        queryParams: { tab }
      });
      return;
    }
    if (this.userId) {
      this.router.navigate(['profile', this.currentUserId, 'users', this.friend.name, this.friend.id], {
        queryParams: { tab }
      });
    }

    if (!this.userId) {
      this.router.navigate([this.friend.name, this.friend.id], { relativeTo: this.route, queryParams: { tab } });
    }
  }

  clickHandler(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'BUTTON') {
      target.classList.contains('friend-mutual-link') ? this.toUsersInfo(UserDashboardTab.mutualFriends) : this.toUsersInfo();
    }
  }

  getFriendCity(locationDto: UserLocationDto): string {
    return this.langService.getLangValue(locationDto?.cityUk, locationDto?.cityEn);
  }

  checkIsOnline(friendId: number): boolean {
    return this.userOnlineStatusService.checkIsOnline(friendId);
  }
}
