import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { calendarImage } from '@shared/components/calendar-base/calendar-image';

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
  public friendsToShow: number;
  public slideIndex = 0;
  public arrows = calendarImage;
  public itemsMap = { 768: 6, 576: 5, 320: 3, 220: 1 };
  @ViewChild('slider', { static: true }) slider: ElementRef;
  @ViewChild('nextArrow', { static: false }) nextArrow: ElementRef;
  @ViewChild('previousArrow', { static: false }) previousArrow: ElementRef;

  constructor(
    private userFriendsService: UserFriendsService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.calculateFriendsToShow();
    this.initUser();
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => (this.currentLang = lang));
    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.calculateFriendsToShow());
  }

  public showUsersFriends(): void {
    this.userFriendsService
      .getAllFriends(this.slideIndex, this.friendsToShow)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (item: FriendArrayModel) => {
          this.usersFriends = item.page;
          this.amountOfFriends = item.totalElements;
          this.updateArrowsVisibility();
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

  @HostListener('window:resize') public onResize() {
    this.calculateFriendsToShow();
  }

  public changeFriends(isNext: boolean) {
    if (isNext) {
      this.slideIndex = (this.slideIndex + 1) % this.usersFriends.length;
    } else if (this.slideIndex > 0) {
      this.slideIndex = (this.slideIndex - 1 + this.usersFriends.length) % this.usersFriends.length;
    } else {
      this.slideIndex = (this.amountOfFriends - 1) / this.friendsToShow;
    }
    this.showUsersFriends();
  }

  private calculateFriendsToShow(): void {
    const newFriendsToShow = this.getFriendsToShow();
    if (newFriendsToShow !== this.friendsToShow) {
      this.friendsToShow = newFriendsToShow;
      if (newFriendsToShow > this.amountOfFriends) {
        this.changeFriends(false);
      }
      this.showUsersFriends();
    }
  }

  private getFriendsToShow() {
    let newFriendsToShow = 0;
    for (const threshold of Object.keys(this.itemsMap)
      .map(Number)
      .sort((a, b) => b - a)) {
      if (window.innerWidth >= threshold) {
        newFriendsToShow = this.itemsMap[threshold];
        break;
      }
    }
    return newFriendsToShow;
  }

  private updateArrowsVisibility(): void {
    const show = this.friendsToShow < this.amountOfFriends ? 'visible' : 'hidden';
    this.renderer.setStyle(this.nextArrow.nativeElement, 'visibility', show);
    this.renderer.setStyle(this.previousArrow.nativeElement, 'visibility', show);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
