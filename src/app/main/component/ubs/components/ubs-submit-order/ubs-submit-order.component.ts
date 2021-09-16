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
  response: any;
  loadingAnim: boolean;
  selectedPayment: string;
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

  getLiqPayButton() {
    this.orderService
      .getLiqPayForm()
      .pipe(takeUntil(this.destroy))
      .subscribe((liqPayButton) => {
        this.response = liqPayButton;
        const responseForm = document.getElementById('liqPayButton');
        responseForm.innerHTML = this.response;
      });
  }

  orderButton(event: any) {
    this.selectedPayment = event.target.value;
    if (this.selectedPayment === 'LiqPay') {
      this.isLiqPay = true;
      this.getLiqPayButton();
    } else {
      this.isLiqPay = false;
    }
  }
}
