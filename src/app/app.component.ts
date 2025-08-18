import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GetCurrentUserAction } from 'src/app/store/actions/auth.actions';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
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
  private readonly destroy$: Subject<void> = new Subject<void>();
  router: Router = inject(Router);
  metaService: MetaService = inject(MetaService);
  offline: boolean;

  ngOnInit(): void {
    this.metaService.setMetaOnRouteChange();
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));

    // google script requires two loads for proper init
    const initialLang = this.localeStorageService.getCurrentLanguage();
    this.googleScript.load(initialLang).then(() => {
      this.googleScript.load(initialLang);
    });

    this.store.dispatch(GetCurrentUserAction());
  }

  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
