import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AllFriendsComponent } from './all-friends/all-friends.component';
import { RecommendedFriendsComponent } from './recommended-friends/recommended-friends.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { searchIcon } from '../../../../../../image-pathes/places-icons';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { FriendArrayModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-friend-dashboard',
  templateUrl: './friend-dashboard.component.html',
  styleUrls: ['./friend-dashboard.component.scss']
})
export class FriendDashboardComponent implements OnInit {
  userId: number;
  destroy$ = new Subject();
  searchTerm$: Subject<string> = new Subject();
  searchIcon = searchIcon;
  hideInput = true;
  allFriendsAmount: number;
  requestFriendsAmount: number;
  private componentRef;

  constructor(
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private userFriendsService: UserFriendsService
  ) {}

  ngOnInit() {
    this.initUser();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.preventFrequentQuery();
    this.hideInputField();
    this.getAllFriends(this.userId);
    this.getFriendsRequests(this.userId);
  }

  preventFrequentQuery() {
    this.searchTerm$.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((value) => {
      this.searchForFriends(value);
    });
  }

  private getAllFriends(userId: number): void {
    this.userFriendsService
      .getAllFriends(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FriendArrayModel) => {
        this.allFriendsAmount = data.totalElements;
      });
  }

  private getFriendsRequests(userId: number): void {
    this.userFriendsService
      .getRequests(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FriendArrayModel) => {
        this.requestFriendsAmount = data.totalElements;
      });
  }

  public onInput(input): void {
    this.searchTerm$.next(input.value);
  }

  public onActivate(outlet): void {
    this.componentRef = outlet;
  }

  public searchForFriends(searchText: string): void {
    if (this.componentRef instanceof RecommendedFriendsComponent) {
      this.componentRef.findUserByName(searchText);
    }
    if (this.componentRef instanceof AllFriendsComponent) {
      this.componentRef.findFriendByName(searchText);
    }
  }

  public hideInputField(): void {
    this.hideInput = this.componentRef instanceof FriendRequestsComponent;
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId: number) => (this.userId = userId));
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.bindLang(lang);
    });
  }
}
