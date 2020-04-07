import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/service/localstorage/local-storage.service';
import {UserService} from '../../../../service/user/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  usersAmount: number;
  readonly guyImage = 'assets/img/guy.png';
  readonly path2 = 'assets/img/path-2.svg';
  readonly path4 = 'assets/img/path-4_3.png';
  readonly path5 = 'assets/img/path-5.png';

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) { }

  userId: number;

  ngOnInit() {
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
    this.userService.countActivatedUsers().subscribe(num => {
      this.usersAmount = num;
    });
  }

  startHabit() {
    this.router.navigate([this.userId, 'habits']);
  }
}
