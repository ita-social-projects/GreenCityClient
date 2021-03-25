import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { Subject } from 'rxjs';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
<<<<<<< HEAD
  styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent implements OnInit, OnDestroy {
=======
  styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent implements OnInit, OnDestroy {

>>>>>>> ee9b77a4840ba7cd32e3eb19a32976e550be63a8
  public requests: FriendModel[] = null;
  public userId: number;
  private destroy$ = new Subject();
  public scroll: boolean;
  public currentPage = 0;
  readonly absent = 'assets/img/noNews.jpg';

<<<<<<< HEAD
  constructor(private localStorageService: LocalStorageService, private userFriendsService: UserFriendsService) {}
=======
  constructor(private localStorageService: LocalStorageService,
              private userFriendsService: UserFriendsService
    ) { }
>>>>>>> ee9b77a4840ba7cd32e3eb19a32976e550be63a8

  ngOnInit() {
    this.initUser();
    this.getRequests();
  }

  public deleteFriendsFromList(id, array) {
<<<<<<< HEAD
    const indexSuggestion = array.findIndex((item) => item.id === id);
=======
    const indexSuggestion = array.findIndex(item => item.id === id);
>>>>>>> ee9b77a4840ba7cd32e3eb19a32976e550be63a8
    array.splice(indexSuggestion, 1);
  }

  public accept(id: number) {

    this.userFriendsService.acceptRequest(this.userId, id).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( () => {
      this.deleteFriendsFromList(id, this.requests);
    });
  }

  public decline(id: number) {
    this.userFriendsService.declineRequest(this.userId, id).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( () => {
      this.deleteFriendsFromList(id, this.requests);
    });
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(
      takeUntil(this.destroy$)
    )
      .subscribe((userId: number) => this.userId = userId);
  }

  public getRequests() {
    this.userFriendsService.getRequests(this.userId).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe (
      (data: FriendArrayModel) => {
        this.requests = data.page;
      },
    );
  }

  public onScroll(): void {
    this.scroll = true;
    this.currentPage += 1;

    this.userFriendsService.getRequests(this.userId, this.currentPage).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      (data: FriendArrayModel) => {
        this.requests = this.requests.concat(data.page);
      },
     );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
