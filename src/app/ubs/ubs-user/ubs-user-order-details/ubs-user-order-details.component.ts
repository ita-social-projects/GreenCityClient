import { Component, Input, OnDestroy } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUserOrderInfo, CheckPaymentStatus } from '../ubs-user-orders-list/models/UserOrder.interface';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent implements OnDestroy {
  @Input()
  order: IUserOrderInfo;
  public currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private localStorageService: LocalStorageService) {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.currentLanguage = lang;
    });
  }
  isPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatus === CheckPaymentStatus.PAID;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
