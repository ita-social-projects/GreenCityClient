import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UserOrdersService } from '../services/user-orders.service';
import { Router } from '@angular/router';
import { BonusesService } from '../ubs-user-bonuses/services/bonuses.service';
import { IUserOrderInfo } from '../ubs-user-orders-list/models/UserOrder.interface';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormControl } from '@angular/forms';

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
  orderIdToScroll: number;
  orderToScroll: any;
  selected = new FormControl(0);
  public infoIcon = './assets/img/icon/info-icon.svg';

  constructor(
    private router: Router,
    private snackBar: MatSnackBarComponent,
    private bonusesService: BonusesService,
    private userOrdersService: UserOrdersService,
    private translate: TranslateService,
    private localStorage: LocalStorageService
  ) {}

  onScroll() {
    const status = this.selected.value === 0 ? 'current' : 'closed';
    const loadedAllCurrentOrders = this.currentOrdersLoadedPage === this.totalCurrentOrdersPages;
    const loadedAllClosedOrders = this.closedOrdersLoadedPage === this.totalClosedOrdersPages;
    if ((status === 'current' && loadedAllCurrentOrders) || (status === 'closed' && loadedAllClosedOrders)) {
      return;
    }
    let page;
    if (status === 'current') {
      this.currentOrdersLoadedPage += 1;
      page = this.currentOrdersLoadedPage;
    } else {
      this.closedOrdersLoadedPage += 1;
      page = this.closedOrdersLoadedPage;
    }
    this.loadOrders(status, page, this.ordersPerPage);
  }

  async loadOrders(status, page, ordersPerPage): Promise<any> {
    const onCurrentOrdersData = (res) => {
      this.currentOrders = [...this.currentOrders, ...res.page];
      this.totalCurrentOrdersPages = res.totalPages;
    };
    const onCLosedOrdersData = (res) => {
      this.closedOrders = [...this.closedOrders, ...res.page];
      this.totalClosedOrdersPages = res.totalPages;
    };
    const loadData = (pg, limit) =>
      status === 'current'
        ? this.userOrdersService.getCurrentUserOrders(pg, limit).toPromise()
        : this.userOrdersService.getClosedUserOrders(pg, limit).toPromise();
    const onData = status === 'current' ? onCurrentOrdersData : onCLosedOrdersData;
    const data = await loadData(page - 1, ordersPerPage);
    onData(data);
  }

  redirectToOrder() {
    const isOrderDataAtSessionStorage = sessionStorage.getItem('key');
    if (sessionStorage.getItem('key')) {
      sessionStorage.removeItem('key');
    }
    this.router.navigate(['ubs', 'order']);
  }

  ngOnInit() {
    forkJoin([
      this.userOrdersService.getCurrentUserOrders(0, this.ordersPerPage),
      this.userOrdersService.getClosedUserOrders(0, this.ordersPerPage),
      this.bonusesService.getUserBonuses()
    ])
      .pipe(take(1))
      .subscribe({
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

    this.orderIdToScroll = this.localStorage.getOrderIdToRedirect();
    if (this.orderIdToScroll) {
      this.openExtendedOrder();
      this.localStorage.setOrderIdToRedirect(0);
    }
  }

  openExtendedOrder(): void {
    this.userOrdersService.getOrderToScroll(this.orderIdToScroll).subscribe((res) => {
      this.orderToScroll = res;
      this.checkOrderStatus(this.orderToScroll);
      this.scrollToOrder();
    });
  }

  checkOrderStatus(order): void {
    const orderStatus: boolean = order.orderStatusEng === 'Done' || order.orderStatusEng === 'Canceled' ? true : false;
    this.chooseTab(orderStatus);
  }

  chooseTab(isOrderClosed: boolean): void {
    if (isOrderClosed) {
      this.selected.setValue(1);
    }
  }

  async scrollToOrder(): Promise<any> {
    const status = this.selected.value === 0 ? 'current' : 'closed';
    let page;
    let isPresent;
    if (status === 'current') {
      isPresent = this.currentOrders.find((item) => item.id === this.orderIdToScroll);
      if (!isPresent) {
        do {
          this.currentOrdersLoadedPage += 1;
          page = this.currentOrdersLoadedPage;
          await this.loadOrders(status, page, this.ordersPerPage);
          isPresent = this.currentOrders.find((item) => item.id === this.orderIdToScroll);
        } while (!isPresent);
      }
    } else {
      isPresent = this.closedOrders.find((item) => item.id === this.orderIdToScroll);
      if (!isPresent) {
        do {
          this.closedOrdersLoadedPage += 1;
          page = this.closedOrdersLoadedPage;
          await this.loadOrders(status, page, this.ordersPerPage);
          isPresent = this.closedOrders.find((item) => item.id === this.orderIdToScroll);
        } while (!isPresent);
      }
    }
    isPresent.extend = true;
    setTimeout(() => this.scroll(this.orderIdToScroll), 0);
  }

  scroll(orderId: number): void {
    const ord: string = orderId.toString();
    document.getElementById(ord).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
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
