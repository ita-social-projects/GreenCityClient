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
  page = 0;
  numberOfCurrentOrders: number;
  numberOfHistoryOrders: number;
  currentOrdersOnPage = 10;
  historyOrdersOnPage = 10;

  constructor(
    private router: Router,
    private snackBar: MatSnackBarComponent,
    private bonusesService: BonusesService,
    private userOrdersService: UserOrdersService,
    private translate: TranslateService
  ) {}

  onPageChange(e) {
    this.page = e;
    const numberOfCurrenordersLeft = this.numberOfCurrentOrders - (e - 1) * 10;
    const numberOfHistoryOrdersLeft = this.numberOfHistoryOrders - (e - 1) * 10;
    this.currentOrdersOnPage = numberOfCurrenordersLeft < 10 ? this.currentOrdersOnPage : 10;
    this.historyOrdersOnPage = numberOfHistoryOrdersLeft < 10 ? this.historyOrdersOnPage : 10;
    this.getOrders(e - 1, this.currentOrdersOnPage, 'current');
    this.getOrders(e - 1, this.historyOrdersOnPage, 'history');
  }

  redirectToOrder() {
    this.router.navigate(['ubs', 'order']);
  }

  public loading(): boolean {
    return this.loadingOrders && this.loadingBonuses;
  }

  ngOnInit() {
    this.getOrders(0, 10, 'current');
    this.getOrders(0, 10, 'history');
    this.bonusesService.getUserBonuses().subscribe((responce: IBonus) => {
      this.bonuses = responce.points;
      this.loadingBonuses = true;
    });
  }

  getOrders(pageNumber: number, ordersOnPage: number, table: string) {
    this.userOrdersService
      .getAllUserOrders(pageNumber, ordersOnPage, table)
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
          this.numberOfCurrentOrders = table === 'current' ? item.totalElements : this.numberOfCurrentOrders;
          this.numberOfHistoryOrders = table === 'history' ? item.totalElements : this.numberOfHistoryOrders;
        }
        this.orders = item.page;
        this.loadingOrders = true;
        this.currentOrders = table === 'current' ? this.orders : this.currentOrders;
        this.orderHistory = table === 'history' ? this.orders : this.orderHistory;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
