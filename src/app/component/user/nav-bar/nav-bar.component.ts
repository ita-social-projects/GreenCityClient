import { Component, OnInit } from '@angular/core';
import { ModalService } from '../_modal/modal.service';
import { MatDialog } from '@angular/material';
import { FavoritePlaceComponent } from '../favorite-place/favorite-place.component';
import { ProposeCafeComponent } from '../propose-cafe/propose-cafe.component';
import { FavoritePlaceService } from '../../../service/favorite-place/favorite-place.service';
import { UserSettingComponent } from '../user-setting/user-setting.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../service/localstorage/local-storage.service';
import { JwtService } from '../../../service/jwt/jwt.service';
import { UserService } from 'src/app/service/user/user.service';
import { AchievementService } from 'src/app/service/achievement/achievement.service';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  readonly notifications = 'assets/img/icon-notifications.png';
  readonly avatar = 'assets/place-holder/avatar.jpg';
  firstName: string;
  userRole: string;
  userId: number;
  isLoggedIn = false;

  constructor(
    private modalService: ModalService,
    public dialog: MatDialog,
    private favoritePlaceService: FavoritePlaceService,
    private localStorageService: LocalStorageService,
    private jwtService: JwtService,
    private router: Router,
    private userService: UserService,
    private achievementService: AchievementService,
    private habitStatisticService: HabitStatisticService
  ) { }

  ngOnInit(): void {
    this.localStorageService.firstNameBehaviourSubject.subscribe(firstName => this.firstName = firstName);
    this.localStorageService.userIdBehaviourSubject
      .pipe(
        filter(userId => userId !== null && !isNaN(userId))
      )
      .subscribe(userId => {
        this.userId = userId;
        this.isLoggedIn = true;
      });
    this.userRole = this.jwtService.getUserRole();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FavoritePlaceComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.favoritePlaceService.getFavoritePlaces();
    });
  }

  openSettingDialog(): void {
    const dialogRef = this.dialog.open(UserSettingComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openDialogProposeCafeComponent(): void {
    const dialogRef = this.dialog.open(ProposeCafeComponent, {
      width: '800px',
      data: 5
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  private signOut() {
    this.localStorageService.clear();
    this.userService.onLogout();
    this.habitStatisticService.onLogout();
    this.achievementService.onLogout();
    this.router.navigate(['/'])
      .then(success => {
        this.isLoggedIn = false;
        console.log('redirect has succeeded ' + success);
      })
      .catch(fail => console.log('redirect has failed ' + fail));
  }
}
