import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-ubs-confirm-page',
  templateUrl: './ubs-confirm-page.component.html',
  styleUrls: ['./ubs-confirm-page.component.scss']
})
export class UbsConfirmPageComponent implements OnInit {
  orderId: string;
  responseStatus: string;

  constructor(private activatedRoute: ActivatedRoute, private snackBar: MatSnackBarComponent) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.orderId = params.order_id;
      this.orderId = '123';
      this.responseStatus = params.response_status;
      this.snackBar.openSnackBar('successConfirmSaveOrder', this.orderId);
    });
  }
}
