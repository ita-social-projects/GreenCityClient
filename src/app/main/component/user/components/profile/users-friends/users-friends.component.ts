import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-users-friends',
  templateUrl: './users-friends.component.html',
  styleUrls: ['./users-friends.component.scss']
})
export class UsersFriendsComponent implements OnInit, OnDestroy {
  public usersFriends: FriendModel[];
  public noFriends = null;
  public userId: number;
  public amountOfFriends: number;
  public destroy$ = new Subject();
  public currentLang: string;
  public friendsToShow = 6;
  public slideIndex = 0;

  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.showUsersFriends();
    this.initUser();
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => (this.currentLang = lang));
    this.calculateFriendsToShow();
  }

  public showUsersFriends(): void {
    const start = this.friendsToShow * this.slideIndex;
    const end = start + this.friendsToShow;
    this.userFriendsService
      .getAllFriends(start, end)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (item: FriendArrayModel) => {
          this.usersFriends = item.page;
          this.amountOfFriends = item.totalElements;
        },
        error: (error) => {
          this.noFriends = error;
        }
      });
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  public showFriendsInfo(friend: FriendModel): void {
    this.router.navigate([`profile/${this.userId}/friends`, friend.name, friend.id]);
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateFriendsToShow();
    this.showUsersFriends();
  }

  public calculateFriendsToShow() {
    const width = window.innerWidth;
    if (width <= 575) {
      this.friendsToShow = 3;
    } else if (width > 576 && width <= 767) {
      this.friendsToShow = 5;
    } else {
      this.friendsToShow = 6;
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
