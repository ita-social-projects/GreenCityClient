import {Component, OnInit} from '@angular/core';
import {ModalService} from "../_modal/modal.service";
import {UserService} from "../../../service/user/user.service";
import {MatDialog} from "@angular/material";
import {ProposeCafeComponent} from "../propose-cafe/propose-cafe.component";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private firstName: string = null;
  private userRole: string;

  constructor(private uService: UserService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem("firstName");
    this.userRole = this.uService.getUserRole();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProposeCafeComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private signOut() {
    localStorage.clear();
    window.location.href = "/";
  }

}
