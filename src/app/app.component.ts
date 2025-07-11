import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GetCurrentUserAction } from 'src/app/store/actions/auth.actions';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { CommonService } from './chat/service/common/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, Subject, take, takeUntil } from 'rxjs';
import { ChatsService } from './chat/service/chats/chats.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { MetaService } from 'src/app/shared/services/meta/meta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private store: Store = inject(Store);
  private googleScript: GoogleScript = inject(GoogleScript);
  private localeStorageService: LocalStorageService = inject(LocalStorageService);
  commonChatSevice: CommonService = inject(CommonService);
  router: Router = inject(Router);
  chatsService: ChatsService = inject(ChatsService);
  metaService: MetaService = inject(MetaService);
  private destroy$: Subject<void> = new Subject<void>();
  offline: boolean;

  ngOnInit(): void {
    this.metaService.setMetaOnRouteChange();
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));

    const initialLang = this.localeStorageService.getCurrentLanguage();
    this.googleScript.load(initialLang).then(() => {});
    this.googleScript.load(initialLang).then(() => {});

    this.store.dispatch(GetCurrentUserAction());
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects.includes('ubs')),
        distinctUntilChanged()
      )
      .subscribe((isSupportChat) => {
        this.commonChatSevice.newMessageWindowRequireCloseStream$.next(true);
        this.chatsService.isSupportChat$.next(isSupportChat);
        this.commonChatSevice.isChatVisible$.next(isSupportChat);
      });
  }

  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
