import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
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
  private totalPages: number;
  private currentPage = 0;
  private userId: number;
  public isActiveInfinityScroll = false;
  public isFetching = true;
  public numberAllFriends: number;
  public currentUserId: number;
  public friendsList: FriendModel[] = [];
  readonly absentContent = 'assets/img/noNews.jpg';

  constructor(private userFriendsService: UserFriendsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params.userId;
    this.currentUserId = +this.route.snapshot.params.id;
    this.getAllFriends(this.userId);
  }

  private getAllFriends(id: number, page?: number): void {
    this.isFetching = true;
    this.userFriendsService
      .getAllFriends(id, page, 2)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.numberAllFriends = data.totalElements;
        this.totalPages = data.totalPages;
        this.friendsList = this.friendsList.concat(data.page);
        this.scroll = false;
        this.isFetching = false;
      });
  }

  public onScroll(): void {
    if (this.scroll && this.friendsList.length === this.numberAllFriends) return;

    this.scroll = true;
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.getAllFriends(this.userId, this.currentPage);
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.isActiveInfinityScroll = tabChangeEvent.index === 3;
  }

  public addFriend(id): void {
    this.userFriendsService
      .addFriend(this.currentUserId, id)
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
