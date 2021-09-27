import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  constructor(private localStorageService: LocalStorageService, private translate: TranslateService) {}

  @ViewChild(RouterOutlet) outlet: RouterOutlet;

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
    if (input.value === '') return;
    this.searchTerm$.next(input.value);
  }

  public searchForFriends(searchText: string): void {
    if (this.outlet.component instanceof RecommendedFriendsComponent) {
      this.outlet.component.findUserByName(searchText);
    }
    if (this.outlet.component instanceof AllFriendsComponent) {
      this.outlet.component.findFriendByName(searchText);
    }
  }

  public hideInputField() {
    setTimeout(() => {
      this.hideInput = this.outlet?.component instanceof FriendRequestsComponent;
    });
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
