import { Component } from '@angular/core';
import { ProposeCafeComponent } from '../../../core/components/propose-cafe/propose-cafe.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss']
})
export class AdminNavComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ProposeCafeComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe();
  }
}
