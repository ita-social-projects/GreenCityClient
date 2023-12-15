import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-friend-profile-dashboard',
  templateUrl: './friend-profile-dashboard.component.html',
  styleUrls: ['./friend-profile-dashboard.component.scss']
})
export class FriendProfileDashboardComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  private scroll = false;
  private currentFriendPage = 0;
  private currentMutualPage = 0;
  private userId: number;
  public isActiveInfinityScroll = false;
  public isFetching = true;
  public numberAllFriends: number;
  public numberAllMutualFriends: number;
  public currentUserId: number;
  public friendsList: FriendModel[] = [];
  public mutualFriendsList: FriendModel[] = [];
  public selectedIndex = 0;
  readonly absentContent = 'assets/img/noNews.svg';

  constructor(
    private userFriendsService: UserFriendsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params.userId;
    this.currentUserId = +this.route.snapshot.params.id;
    this.selectedIndex = +this.route.snapshot.queryParams.index;
    this.isActiveInfinityScroll = this.selectedIndex === 3 || this.selectedIndex === 4;
    this.getAllFriends(this.userId);
    this.getMutualFriends();
  }

  private getAllFriends(id: number, page?: number): void {
    this.isFetching = true;
    this.userFriendsService
      .getAllFriends(id, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.numberAllFriends = data.totalElements;
        this.friendsList = this.friendsList.concat(data.page);
        this.scroll = false;
        this.isFetching = false;
      });
  }

  private getMutualFriends(page?: number): void {
    this.isFetching = true;
    this.userFriendsService
      .getNewFriends('', page)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.numberAllMutualFriends = data.totalElements;
        this.mutualFriendsList = this.mutualFriendsList.concat(data.page);
        this.scroll = false;
        this.isFetching = false;
      });
  }

  public onScroll(): void {
    if (this.selectedIndex === 3 && !this.scroll && this.friendsList.length < this.numberAllFriends) {
      this.scroll = true;
      this.currentFriendPage += 1;
      this.getAllFriends(this.userId, this.currentFriendPage);
    }
    if (this.selectedIndex === 4 && !this.scroll && this.mutualFriendsList.length < this.numberAllMutualFriends) {
      this.scroll = true;
      this.currentMutualPage += 1;
      this.getMutualFriends(this.currentMutualPage);
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    const url = this.router
      .createUrlTree([], { relativeTo: this.route, queryParams: { tab: tabChangeEvent.tab.textLabel, index: tabChangeEvent.index } })
      .toString();
    this.location.replaceState(url);
    this.isActiveInfinityScroll = tabChangeEvent.index === 3 || tabChangeEvent.index === 4;
  }

  public addFriend(id: number): void {
    this.userFriendsService
      .addFriend(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.friendsList = this.friendsList.filter((user) => user.id !== id);
        },
        (err) => console.error(err.message)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
