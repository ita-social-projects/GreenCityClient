import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { FocusDetectionService } from './focus-detection.service';
import { GoogleScript } from 'src/assets/google-script/google-script';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  offline: boolean;

  constructor(private updates: SwUpdate, private focusDetectionService: FocusDetectionService, private googleScript: GoogleScript) {
    updates.available.subscribe((event) => {
      updates.activateUpdate().then(() => document.location.reload());
    });
  }

  ngOnInit(): void {
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
    this.googleScript.load('uk');
    console.log('App init');
  }

  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
  }
}
