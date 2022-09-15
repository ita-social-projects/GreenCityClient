import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UserOrdersService } from '../services/user-orders.service';
import { Router } from '@angular/router';
import { BonusesService } from '../ubs-user-bonuses/services/bonuses.service';
import { IUserOrderInfo } from '../ubs-user-orders-list/models/UserOrder.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ubs-user-orders',
  templateUrl: './ubs-user-orders.component.html',
  styleUrls: ['./ubs-user-orders.component.scss']
})
export class UbsUserOrdersComponent implements OnInit, OnDestroy {
  destroy: Subject<boolean> = new Subject<boolean>();
  currentOrders: IUserOrderInfo[] = [];
  closedOrders: IUserOrderInfo[] = [];
  bonuses: number;
  loading = true;
  currentOrdersLoadedPage = 1;
  closedOrdersLoadedPage = 1;
  ordersPerPage = 10;
  totalCurrentOrdersPages: number;
  totalClosedOrdersPages: number;
  currentTabIdx = 0;

  constructor(
    private router: Router,
    private snackBar: MatSnackBarComponent,
    private bonusesService: BonusesService,
    private userOrdersService: UserOrdersService,
    private translate: TranslateService
  ) {}

  onTabChange(newTabIdx) {
    this.currentTabIdx = newTabIdx;
  }

  onScroll() {
    if (this.currentTabIdx === 0) {
      if (this.currentOrdersLoadedPage + 1 > this.totalCurrentOrdersPages) {
        return;
      }
      this.currentOrdersLoadedPage += 1;
      this.loadCurrentOrders(this.currentOrdersLoadedPage, this.ordersPerPage);
      return;
    }
    if (this.closedOrdersLoadedPage + 1 > this.totalClosedOrdersPages) {
      return;
    }
    this.closedOrdersLoadedPage += 1;
    this.loadClosedOrders(this.closedOrdersLoadedPage, this.ordersPerPage);
  }

  loadCurrentOrders(page, ordersPerPage) {
    this.userOrdersService.getCurrentUserOrders(page - 1, ordersPerPage).subscribe({
      next: (data) => {
        this.currentOrders = [...this.currentOrders, ...data.page];
        this.totalCurrentOrdersPages = data.totalPages;
      },
      error: (err) => this.displayError(err)
    });
  }

  loadClosedOrders(page, ordersPerPage) {
    this.userOrdersService.getClosedUserOrders(page - 1, ordersPerPage).subscribe({
      next: (data) => {
        this.closedOrders = [...this.closedOrders, ...data.page];
        this.totalClosedOrdersPages = data.totalPages;
      },
      error: (err) => this.displayError(err)
    });
  }

  redirectToOrder() {
    this.router.navigate(['ubs', 'order']);
  }

  ngOnInit() {
    forkJoin([
      this.userOrdersService.getCurrentUserOrders(0, this.ordersPerPage),
      this.userOrdersService.getClosedUserOrders(0, this.ordersPerPage),
      this.bonusesService.getUserBonuses()
    ]).subscribe({
      next: (results) => {
        const [current, closed, bonuses] = results;
        this.currentOrders = current.page ?? [];
        this.closedOrders = closed.page ?? [];
        this.bonuses = bonuses.points ?? 0;
        this.totalCurrentOrdersPages = current.totalPages;
        this.totalClosedOrdersPages = closed.totalPages;
        this.loading = false;
      },
      error: (err) => this.displayError(err)
    });
  }

  displayError(error) {
    const errorMessage = this.translate.instant('snack-bar.error.default');
    this.snackBar.openSnackBar(errorMessage);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
