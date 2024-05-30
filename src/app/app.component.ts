import { Component, OnInit } from '@angular/core';
import { GoogleScript } from 'src/assets/google-script/google-script';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  offline: boolean;

  constructor(private googleScript: GoogleScript) {}

  ngOnInit(): void {
    this.onNetworkStatusChange();
    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
    this.googleScript.load('uk');
  }

  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
  }
}
