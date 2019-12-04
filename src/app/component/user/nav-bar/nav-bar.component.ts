import { Component, OnInit } from '@angular/core';
import { ModalService } from '../_modal/modal.service';
import { MatDialog } from '@angular/material';
import { FavoritePlaceComponent } from '../favorite-place/favorite-place.component';
import { ProposeCafeComponent } from '../propose-cafe/propose-cafe.component';
import { FavoritePlaceService } from '../../../service/favorite-place/favorite-place.service';
import { UserSettingComponent } from '../user-setting/user-setting.component';
import { ActivatedRoute, Router } from '@angular/router';
import {LocalStorageService} from '../../../service/localstorage/local-storage.service';
import {JwtService} from '../../../service/jwt/jwt.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  firstName: string = null;
  userRole: string;
  userId: string;
  id: number;

  constructor(
    private modalService: ModalService,
    public dialog: MatDialog,
    private favoritePlaceService: FavoritePlaceService,
    private localStorageService: LocalStorageService,
    private jwtService: JwtService
    private favoritePlaceService: FavoritePlaceService,
    private rout: Router,
    private route: ActivatedRoute
  ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(FavoritePlaceComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.favoritePlaceService.getFavoritePlaces();
    });
  }

  openSettingDialog(): void {
    const dialogRef = this.dialog.open(UserSettingComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem('firstName');
    this.userRole = this.uService.getUserRole();
    this.id = +window.localStorage.getItem('userId');
    this.firstName = this.localStorageService.getFirsName();
    this.userRole = this.jwtService.getUserRole();
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
    window.location.href = '/GreenCityClient/'; // TODO - use angular routing instead!
    this.rout.navigate(['/GreenCityClient']);
  }
}
