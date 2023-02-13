import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { IUserOrderInfo, CheckPaymentStatus } from '../ubs-user-orders-list/models/UserOrder.interface';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent implements OnDestroy, OnInit {
  @Input()
  order: IUserOrderInfo;
  public currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public certificatesAmount: number;

  constructor(private localStorageService: LocalStorageService, private langService: LanguageService) {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe((lang: string) => {
      this.currentLanguage = lang;
    });
  }

  ngOnInit(): void {
    this.certificatesAmount = this.order.certificate.reduce((acc, item) => acc + item.points, 0);
  }

  isPaid(order: IUserOrderInfo): boolean {
    return order.paymentStatus === CheckPaymentStatus.PAID;
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
