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
  page: number;
  numberOfOrders: number;
  ordersOnPage = 10;

  constructor(
    private router: Router,
    private snackBar: MatSnackBarComponent,
    private bonusesService: BonusesService,
    private userOrdersService: UserOrdersService,
    private translate: TranslateService
  ) {}

  onPageChange(e) {
    const ordersLeft = this.numberOfOrders - (e - 1) * 10;
    this.ordersOnPage = ordersLeft < 10 ? ordersLeft : 10;
    this.getOrders(e - 1, this.ordersOnPage);
  }

  redirectToOrder() {
    this.router.navigate(['ubs', 'order']);
  }

  public loading(): boolean {
    return this.loadingOrders && this.loadingBonuses;
  }

  ngOnInit() {
    this.getOrders(0, 10);
    this.bonusesService.getUserBonuses().subscribe((responce: IBonus) => {
      this.bonuses = responce.points;
      this.loadingBonuses = true;
    });
  }

  getOrders(pageNumber: number, ordersOnPage: number) {
    this.userOrdersService
      .getAllUserOrders(pageNumber, ordersOnPage)
      .pipe(
        takeUntil(this.destroy),
        catchError((err) => {
          const errorMessage = this.translate.instant('snack-bar.error.default');
          this.snackBar.openSnackBar(errorMessage);
          return throwError(err);
        })
      )
      .subscribe((item) => {
        if (pageNumber === 0) {
          this.numberOfOrders = item.totalElements;
        }
        this.orders = item.page;
        this.loadingOrders = true;
        this.currentOrders = this.orders.filter(
          (order) => order.orderStatusEng !== CheckOrderStatus.DONE && order.orderStatusEng !== CheckOrderStatus.CANCELED
        );
        this.orderHistory = this.orders.filter(
          (order) => order.orderStatusEng === CheckOrderStatus.DONE || order.orderStatusEng === CheckOrderStatus.CANCELED
        );
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
