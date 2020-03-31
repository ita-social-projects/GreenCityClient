import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/service/localstorage/local-storage.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})

export class AboutPageComponent implements OnInit {
  public actualYear = new Date().getFullYear();
  private userId: number;
  private usersAmount: number;

  constructor(private titleService: Title,
              private router: Router,
              private localStorageService: LocalStorageService,
              private userService: UserService) { }

  ngOnInit() {
    this.titleService.setTitle('About');
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
    this.userService.countActivatedUsers().subscribe(num => {
      this.usersAmount = num;
    });
  }

  startHabit() {
    this.router.navigate([this.userId, 'habits']);
  }
}
