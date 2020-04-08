import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/service/localstorage/local-storage.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})

export class AboutPageComponent implements OnInit {
  public actualYear = new Date().getFullYear();
  private userId: number;

  constructor(private router: Router,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  private navigateToHabit(): void {
    this.router.navigate([this.userId, 'habits']);
  }
}
