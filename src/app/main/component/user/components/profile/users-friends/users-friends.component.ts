import { Friend, UserFriendsInterface } from './../../../../../interface/user/user-friends.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users-friends',
  templateUrl: './users-friends.component.html',
  styleUrls: ['./users-friends.component.scss']
})
export class UsersFriendsComponent implements OnInit, OnDestroy {
  public usersFriends;
  public noFriends = null;
  public userId: number;
  public amountOfFriends: number;
  public destroy$ = new Subject();
  public currentLang: string;

  constructor(
    private profileService: ProfileService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.showUsersFriends();
    this.initUser();
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => (this.currentLang = lang));
  }

  public showUsersFriends(): void {
    this.profileService
      .getUserFriends()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (item: UserFriendsInterface) => {
          this.usersFriends = item.pagedFriends.page;
          this.amountOfFriends = item.amountOfFriends;
        },
        (error) => {
          this.noFriends = error;
        }
      );
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  public showFriendsInfo(friend: Friend): void {
    this.router.navigate(['friends', friend.name, friend.id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
