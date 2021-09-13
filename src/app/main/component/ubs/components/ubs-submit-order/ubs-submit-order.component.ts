import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bag, OrderDetails, PersonalData } from '../../models/ubs.interface';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent extends FormBaseComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup = this.fb.group({});
  bags: Bag[] = [];
  loadingAnim: boolean;
  selectedDay: string;
  isLiqPay = false;
  additionalOrders: number[];
  personalData: PersonalData;
  orderDetails: OrderDetails;
  private destroy: Subject<boolean> = new Subject<boolean>();
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'confirmation.title',
      popupSubtitle: 'confirmation.subTitle',
      popupConfirm: 'confirmation.cancel',
      popupCancel: 'confirmation.dismiss'
    }
  };
  isValidOrder = true;

  constructor(
    private orderService: OrderService,
    private shareFormService: UBSOrderFormService,
    private fb: FormBuilder,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog);
  }

  ngOnInit(): void {
    this.takeOrderDetails();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  getFormValues(): boolean {
    return true;
  }

  takeOrderDetails() {
    this.shareFormService.changedOrder.pipe(takeUntil(this.destroy)).subscribe((orderDetails: OrderDetails) => {
      this.orderDetails = orderDetails;
      this.bags = orderDetails.bags.filter((bagItem) => bagItem.quantity !== null);
      this.additionalOrders = orderDetails.additionalOrders;
      this.isValidOrder = orderDetails.finalSum <= 0;
    });
    this.shareFormService.changedPersonalData.pipe(takeUntil(this.destroy)).subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
    });
  }

  redirectToOrder() {
    this.loadingAnim = true;
    this.orderService
      .getOrderUrl()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (fondyUrl) => {
          this.shareFormService.orderUrl = fondyUrl.toString();
          document.location.href = this.shareFormService.orderUrl;
          this.loadingAnim = false;
        },
        (error) => {
          this.loadingAnim = false;
        }
      );
  }

  showconsole() {
    this.orderService
      .getLiqPayForm()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (fondyUrl1) => {
          console.log(fondyUrl1);
        },
        (error) => {
          this.loadingAnim = false;
        }
      );
  }

  orderButton(event: any) {
    // const select = document.getElementsByClassName('payment-select') as HTMLSelectElement;
    // const value = select.options[select.selectedIndex].value;
    // if (value === 'LiqPay') {
    //   this.isLiqPay = true;
    //   console.log('liqpay');
    // }
    this.selectedDay = event.target.value;
    if (this.selectedDay === 'LiqPay') {
      console.log(event.target.value);
    }
  }
}
