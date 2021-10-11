import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UbsAdminCancelModalComponent } from '../ubs-admin-cancel-modal/ubs-admin-cancel-modal.component';
import { UbsAdminGoBackModalComponent } from '../ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';

@Component({
  selector: 'app-ubs-admin-order',
  templateUrl: './ubs-admin-order.component.html',
  styleUrls: ['./ubs-admin-order.component.scss']
})
export class UbsAdminOrderComponent {
  order;
  constructor(private router: Router, private dialog: MatDialog) {
    this.order = this.router.getCurrentNavigation().extras.state.order;
  }
  openCancelModal(): void {
    this.dialog.open(UbsAdminCancelModalComponent);
  }

  openGoBackModal(): void {
    this.dialog.open(UbsAdminGoBackModalComponent);
  }
}
