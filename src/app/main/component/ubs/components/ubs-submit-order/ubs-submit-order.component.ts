import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bag, OrderDetails, OrderDetailsNotification, PersonalData } from '../../models/ubs.interface';
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
  isDownloadDataNotification: boolean;
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
  @Input() public isNotification: boolean;
  @Input() public orderIdFromNotification: number;

  constructor(
    private orderService: OrderService,
    private shareFormService: UBSOrderFormService,
    public ubsOrderFormService: UBSOrderFormService,
    private fb: FormBuilder,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog);
  }

  ngOnInit(): void {
    if (this.isNotification) {
      this.isDownloadDataNotification = false;
      this.getOrderFormNotifications();
    } else {
      this.takeOrderDetails();
    }
  }

  getOrderFormNotifications() {
    this.orderService
      .getOrderFromNotification(this.orderIdFromNotification)
      .pipe(takeUntil(this.destroy))
      .subscribe((response: OrderDetailsNotification) => {
        this.bags = response.bags;
        this.bags.forEach((item) => {
          item.name = 'Clothes';
          item.quantity = response.amountOfBagsOrdered[item.id];
        });
        this.additionalOrders = [];
        this.orderDetails = {
          bags: null,
          points: response.orderBonusDiscount,
          certificates: null,
          additionalOrders: null,
          orderComment: null,
          pointsSum: null,
          minAmountOfBigBags: null,
          total: response.orderFullPrice,
          finalSum: response.orderDiscountedPrice,
          certificatesSum: response.orderCertificateTotalDiscount,
          pointsToUse: response.orderBonusDiscount
        };
        this.personalData = {
          id: null,
          firstName: response.recipientName,
          lastName: response.recipientSurname,
          email: response.recipientEmail,
          phoneNumber: response.recipientPhone,
          anotherClientFirstName: null,
          anotherClientLastName: null,
          anotherClientEmail: null,
          anotherClientPhoneNumber: null,
          addressComment: response.addressComment,
          city: response.addressCity,
          district: response.addressDistrict,
          street: response.addressStreet,
          houseCorpus: null,
          entranceNumber: null,
          houseNumber: null,
          longitude: null,
          latitude: null
        };
        /* this.orderDetails.total = response.orderFullPrice;
         this.orderDetails.finalSum = response.orderDiscountedPrice;
         this.orderDetails.certificatesSum = response.orderCertificateTotalDiscount;
         this.orderDetails.pointsToUse = response.orderBonusDiscount;*/
        /* this.personalData.anotherClientFirstName = response.recipientName;
         this.personalData.anotherClientLastName = response.recipientSurname;
         this.personalData.email = response.recipientEmail;
         this.personalData.addressComment = response.addressComment;
         this.personalData.anotherClientPhoneNumber = response.recipientPhone;
         this.personalData.city = response.addressCity;
         this.personalData.street = response.addressStreet;
         this.personalData.district = response.addressDistrict;*/
        this.isValidOrder = response.orderDiscountedPrice <= 0;
        this.isDownloadDataNotification = true;
      });
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
          console.log(fondyUrl.toString());
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
