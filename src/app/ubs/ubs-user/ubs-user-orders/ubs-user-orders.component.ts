import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UserOrdersService } from '../services/user-orders.service';
import { Router } from '@angular/router';
import { BonusesService } from '../ubs-user-bonuses/services/bonuses.service';
import { IBonus } from '../ubs-user-bonuses/models/IBonus.interface';
import { IUserOrderInfo, CheckOrderStatus } from '../ubs-user-orders-list/models/UserOrder.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ubs-user-orders',
  templateUrl: './ubs-user-orders.component.html',
  styleUrls: ['./ubs-user-orders.component.scss']
})
export class UbsUserOrdersComponent implements OnInit, OnDestroy {
  destroy: Subject<boolean> = new Subject<boolean>();
  orders: IUserOrderInfo[];
  currentOrders: IUserOrderInfo[];
  orderHistory: IUserOrderInfo[];
  bonuses: number;
  loadingOrders = false;
  loadingBonuses = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBarComponent,
    private bonusesService: BonusesService,
    private userOrdersService: UserOrdersService,
    private translate: TranslateService
  ) {}

  redirectToOrder() {
    this.router.navigate(['ubs', 'order']);
  }

  public loading(): boolean {
    return this.loadingOrders && this.loadingBonuses;
  }

  ngOnInit() {
    this.userOrdersService
      .getAllUserOrders()
      .pipe(
        takeUntil(this.destroy),
        catchError((err) => {
          const errorMessage = this.translate.instant('snack-bar.error.default');
          this.snackBar.openSnackBar(errorMessage);
          return throwError(err);
        })
      )
      .subscribe((item) => {
        this.orders = item.page;
        this.loadingOrders = true;
        this.currentOrders = this.orders.filter(
          (order) => order.orderStatus !== CheckOrderStatus.DONE && order.orderStatus !== CheckOrderStatus.CANCELED
        );
        this.orderHistory = this.orders.filter(
          (order) => order.orderStatus === CheckOrderStatus.DONE || order.orderStatus === CheckOrderStatus.CANCELED
        );
      });
    this.bonusesService.getUserBonuses().subscribe((responce: IBonus) => {
      this.bonuses = responce.points;
      this.loadingBonuses = true;
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
