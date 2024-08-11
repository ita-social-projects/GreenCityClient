import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GetCurrentUserAction } from 'src/app/store/actions/auth.actions';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { CommonService } from './chat/service/common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private store: Store = inject(Store);
  private googleScript: GoogleScript = inject(GoogleScript);
  commoChatSevice: CommonService = inject(CommonService);

  offline: boolean;

  ngOnInit(): void {
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
    this.googleScript.load('uk');
    this.store.dispatch(GetCurrentUserAction());
  }

  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
  }
}
