import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddViolationsComponent } from '../add-violations/add-violations.component';

@Component({
  selector: 'app-ubs-header',
  templateUrl: './ubs-header.component.html',
  styleUrls: ['./ubs-header.component.scss']
})
export class UbsHeaderComponent {
  constructor(private dialog: MatDialog) {}
  openModal() {
    this.dialog.open(AddViolationsComponent, { height: '90%', maxWidth: '560px' });
  }
}
