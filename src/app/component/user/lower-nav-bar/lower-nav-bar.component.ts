import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/service/localstorage/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lower-nav-bar',
  templateUrl: './lower-nav-bar.component.html',
  styleUrls: ['./lower-nav-bar.component.css']
})
export class LowerNavBarComponent implements OnInit {
  readonly logo = 'assets/img/logo.png';

  private userId: number;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() { this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId); }

  scrollTo(elementId) {
    const element = document.getElementById(elementId);
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  getUserId(): number | string {
    if (this.userId !== null && !isNaN(this.userId)) {
      return this.userId;
    }
    return 'not_signed_in';
  }
}
