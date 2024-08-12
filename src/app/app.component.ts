import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GetCurrentUserAction } from 'src/app/store/actions/auth.actions';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { CommonService } from './chat/service/common/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { ChatsService } from './chat/service/chats/chats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private store: Store = inject(Store);
  private googleScript: GoogleScript = inject(GoogleScript);
  commonChatSevice: CommonService = inject(CommonService);
  router: Router = inject(Router);
  chatsService: ChatsService = inject(ChatsService);

  offline: boolean;

  ngOnInit(): void {
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
    this.googleScript.load('uk');
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
}
