import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UserOrdersService } from '../services/user-orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-user-orders',
  templateUrl: './ubs-user-orders.component.html',
  styleUrls: ['./ubs-user-orders.component.scss']
})
export class UbsUserOrdersComponent implements OnInit, OnDestroy {
  destroy: Subject<boolean> = new Subject<boolean>();
  orders: any[];
  currentOrders: any[];
  orderHistory: any[];
  loading = false;
  constructor(private router: Router, private snackBar: MatSnackBarComponent, private userOrdersService: UserOrdersService) {}

  redirectToOrder() {
    this.router.navigate(['ubs', 'order']);
  }

  ngOnInit() {
    this.userOrdersService
      .getAllUserOrders()
      .pipe(
        takeUntil(this.destroy),
        catchError((err) => {
          this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.');
          return throwError(err);
        })
      )
      .subscribe((item) => {
        this.orders = item;
        this.loading = true;
        this.currentOrders = this.orders.filter(
          (order) => order.generalOrderInfo.orderStatus !== 'DONE' && order.generalOrderInfo.orderStatus !== 'CANCELED'
        );
        this.orderHistory = this.orders.filter(
          (order) => order.generalOrderInfo.orderStatus === 'DONE' || order.generalOrderInfo.orderStatus === 'CANCELED'
        );
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
