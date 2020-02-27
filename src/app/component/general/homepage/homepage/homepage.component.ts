import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/service/localstorage/local-storage.service';
import {UserService} from '../../../../service/user/user.service';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WindowsigninComponent } from 'src/app/component/user/modal-auth/windowsignin/windowsignin.component';


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
  isLoggedIn: any;
  matDialogRef: MatDialogRef<WindowsigninComponent>;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  userId: number;

  ngOnInit() {
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
    this.userService.countActivatedUsers().subscribe(num => {
      this.usersAmount = num;
      if (this.isLoggedIn) {
        return this.matDialogRef.close();
        console.log('close popup');
      }  // close popup
    });
  }

  startHabit() {
    this.router.navigate([this.userId, 'habits']);
  }
}
