import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendModel, UserDashboardTab } from '@global-user/models/friend.model';
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
  public userId: number;
  public isActiveInfinityScroll = false;
  public isFetching = true;
  public numberAllFriends: number;
  public numberAllMutualFriends: number;
  public currentUserId: number;
  public friendsList: FriendModel[] = [];
  public mutualFriendsList: FriendModel[] = [];
  public selectedIndex = 0;
  public userDashboardTab = UserDashboardTab;
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
    this.selectedIndex = +Object.keys(UserDashboardTab).indexOf(this.route.snapshot.queryParams.tab);
    this.isActiveInfinityScroll = this.selectedIndex === 3 || this.selectedIndex === 4;
    this.getAllFriends(this.userId);
    this.getMutualFriends();
  }

  private getAllFriends(id: number, page?: number): void {
    this.isFetching = true;
    this.userFriendsService
      .getUserFriends(id)
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
      .getMutualFriends(this.userId, page)
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
    const tabName = Object.values(UserDashboardTab)[tabChangeEvent.index];
    const url = this.router.createUrlTree([], { relativeTo: this.route, queryParams: { tab: tabName } }).toString();
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
