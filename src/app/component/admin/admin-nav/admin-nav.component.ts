import {Component, OnInit} from '@angular/core';
import {ProposeCafeComponent} from "../../user/propose-cafe/propose-cafe.component";
import {UserService} from "../../../service/user/user.service";
import {MatDialog} from "@angular/material";
import {UpdateCafeComponent} from "../update-cafe/update-cafe.component";

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit {
  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProposeCafeComponent, {
      width: '800px'
  });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
