import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AllFriendsComponent } from './all-friends/all-friends.component';
import { RecommendedFriendsComponent } from './recommended-friends/recommended-friends.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { searchIcon } from '../../../../../../image-pathes/places-icons';

@Component({
  selector: 'app-friend-dashboard',
  templateUrl: './friend-dashboard.component.html',
  styleUrls: ['./friend-dashboard.component.scss']
})
export class FriendDashboardComponent implements OnInit, OnDestroy {
  public userId: number;
  public langChangeSub: Subscription;
  public destroy$ = new Subject();
  public searchTerm$: Subject<string> = new Subject();
  public searchIcon = searchIcon;
  public hideInput = true;
  private componentRef;
  constructor(private localStorageService: LocalStorageService, private translate: TranslateService) {}

  ngOnInit() {
    this.initUser();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.preventFrequentQuery();
    this.hideInputField();
  }

  preventFrequentQuery() {
    this.searchTerm$.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((value) => {
      this.searchForFriends(value);
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
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
    this.searchTerm$.complete();
  }
}
