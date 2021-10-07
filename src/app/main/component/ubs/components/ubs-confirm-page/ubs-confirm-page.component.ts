import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { InterceptorService } from 'src/app/shared/interceptors/interceptor.service';

@Component({
  selector: 'app-ubs-confirm-page',
  templateUrl: './ubs-confirm-page.component.html',
  styleUrls: ['./ubs-confirm-page.component.scss']
})
export class UbsConfirmPageComponent implements OnInit {
  orderId: string;
  responseStatus: string;
  orderResponseError = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBarComponent,
    private jwtService: JwtService,
    private interceptorService: InterceptorService,
    public router: Router
  ) {}

  toPersonalAccount() {
    this.jwtService.userRole$.subscribe((userRole) => {
      const isAdmin = userRole === 'ROLE_ADMIN';
      this.router.navigate([isAdmin ? 'ubs-admin' : 'ubs-user', 'orders']);
    });
  }

  ngOnInit() {
    this.orderResponseError = this.interceptorService.getOrderResponseErrorStatus();
    this.orderResponseError ||
      this.activatedRoute.queryParams.subscribe((params) => {
        this.orderId = params.order_id;
        this.orderId = '123';
        this.responseStatus = params.response_status;
        this.snackBar.openSnackBar('successConfirmSaveOrder', this.orderId);
      });
  }
}
