import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { Subject } from 'rxjs';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent implements OnInit {
  public requests: FriendModel[] = null;
  public userId: number;
  private destroy$ = new Subject();
  public scroll: boolean;
  public currentPage = 0;
  readonly absent = 'assets/img/noNews.svg';

  constructor(private localStorageService: LocalStorageService, private userFriendsService: UserFriendsService) {}

  ngOnInit() {
    this.initUser();
    this.getRequests();
  }

  private deleteFriendsFromList(id, array) {
    const indexSuggestion = array.findIndex((item) => item.id === id);
    array.splice(indexSuggestion, 1);
  }

  public accept(id: number) {
    this.userFriendsService
      .acceptRequest(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.deleteFriendsFromList(id, this.requests);
      });
  }

  public decline(id: number) {
    this.userFriendsService
      .declineRequest(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.deleteFriendsFromList(id, this.requests);
      });
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  private getRequests() {
    this.userFriendsService
      .getRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FriendArrayModel) => {
        this.requests = data.page;
      });
  }

  public onScroll(): void {
    this.scroll = true;
    this.currentPage += 1;
    this.userFriendsService
      .getRequests(this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FriendArrayModel) => {
        this.requests = this.requests.concat(data.page);
      });
  }
}
