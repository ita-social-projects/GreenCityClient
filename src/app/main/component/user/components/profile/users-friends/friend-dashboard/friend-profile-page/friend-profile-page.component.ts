import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EditProfileModel } from '@global-user/models/edit-profile.model';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { FriendModel, FriendArrayModel } from '@global-user/models/friend.model';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from '@global-service/socket/socket.service';

@Component({
  selector: 'app-friend-profile-page',
  templateUrl: './friend-profile-page.component.html',
  styleUrls: ['./friend-profile-page.component.scss']
})
export class FriendProfilePageComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  public requests: FriendModel[] = null;
  public userId: number;
  public userInfo: EditProfileModel;
  public progress: ProfileStatistics;
  public isRequest: boolean;
  public showButtons = true;

  constructor(
    private userFriendsService: UserFriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private SocketService: SocketService
  ) {}

  ngOnInit() {
    this.translate.setDefaultLang(this.localStorageService.getCurrentLanguage());
    this.bindLang();
    this.userId = this.route.snapshot.params.userId;
    this.isRequest = this.router.url?.includes('requests');
    this.getUserInfo(this.userId);
    this.getUserActivities();
    this.getRequests();
    this.SocketService.onMessage(`/topic/${this.userId}/onlineStatus/`).subscribe((data) => {
      console.log(`${this.userId} is ${data.isOnline ? 'online' : 'offline'}`);
    });
  }

  private bindLang(): void {
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => this.translate.setDefaultLang(lang));
  }
  sendSocketMessage() {
    this.SocketService.send(`/app/friends/isOnline/${this.userId}`, {});
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
      .getUserProfileStatistics(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.progress = data;
      });
  }

  private deleteFriendsFromList(id: number, array: FriendModel[]): FriendModel[] {
    return array.filter((item) => item.id !== id);
  }

  public accept(id: number): void {
    this.userFriendsService
      .acceptRequest(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.requests = this.deleteFriendsFromList(id, this.requests);
      });
    this.showButtons = false;
  }

  public decline(id: number): void {
    this.userFriendsService
      .declineRequest(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.requests = this.deleteFriendsFromList(id, this.requests);
      });
    this.showButtons = false;
  }

  private getRequests(): void {
    this.userFriendsService
      .getRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FriendArrayModel) => {
        this.requests = data.page;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
