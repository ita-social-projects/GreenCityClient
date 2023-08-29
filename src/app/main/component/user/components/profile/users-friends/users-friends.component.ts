import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { MaxTextLengthPipe } from 'src/app/ubs/ubs-admin/components/shared/max-text-length/max-text-length.pipe';

@Component({
  selector: 'app-users-friends',
  templateUrl: './users-friends.component.html',
  styleUrls: ['./users-friends.component.scss'],
  providers: [MaxTextLengthPipe]
})
export class UsersFriendsComponent implements OnInit, OnDestroy {
  public usersFriends;
  public noFriends = null;
  public userId: number;
  public amountOfFriends: number;
  public destroy$ = new Subject();
  public currentLang: string;

  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    public maxTextLengthPipe: MaxTextLengthPipe
  ) {}

  ngOnInit() {
    this.showUsersFriends();
    this.initUser();
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => (this.currentLang = lang));
  }

  public showUsersFriends(): void {
    this.userFriendsService
      .getAllFriends(0, 6)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (item: FriendArrayModel) => {
          this.usersFriends = item.page;
          this.amountOfFriends = item.page.length;
        },
        (error) => {
          this.noFriends = error;
        }
      );
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  public showFriendsInfo(friend: FriendModel): void {
    this.router.navigate(['friends', friend.name, friend.id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
