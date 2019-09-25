import {Component, OnInit} from '@angular/core';
import {ModalService} from '../_modal/modal.service';
import {UserService} from '../../../service/user/user.service';
import {MatDialog} from '@angular/material';
import {FavoritePlaceComponent} from '../favorite-place/favorite-place.component';
import {router} from '../../../router';
import {ProposeCafeComponent} from "../propose-cafe/propose-cafe.component";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private firstName: string = null;
  private userRole: string;

  constructor(private uService: UserService, private modalService: ModalService, public dialog: MatDialog) {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FavoritePlaceComponent, {
       width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem('firstName');
    this.userRole = this.uService.getUserRole();
  }

  openDialogProposeCafeComponent(): void {
    const dialogRef = this.dialog.open(ProposeCafeComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // private signOut() {
  //   localStorage.clear();
  // }
  private signOut() {
    localStorage.clear();
    window.location.href = '/';
  }

}
