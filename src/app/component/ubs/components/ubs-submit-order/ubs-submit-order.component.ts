import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Bag, OrderDetails, PersonalData } from '../../models/ubs.interface';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

@Component({
  selector: 'app-ubs-submit-order',
  templateUrl: './ubs-submit-order.component.html',
  styleUrls: ['./ubs-submit-order.component.scss']
})
export class UBSSubmitOrderComponent implements OnInit {
  paymentForm: FormGroup = this.fb.group({});
  bags: Bag[] = [];
  personalData: PersonalData;
  orderDetails: OrderDetails;

  displayMes = true;
  bill: any;
  finalOrder: any;

  bagSumClothesM: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private shareFormService: UBSOrderFormService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.takeOrderDetails();

    this.shareFormService.finalObject.pipe(takeUntil(this.destroy)).subscribe(order => {
      this.finalOrder = order;
    });

    this.shareFormService.billObjectSource.pipe(takeUntil(this.destroy)).subscribe(order => {
      this.bill = order;
    });
  }

  takeOrderDetails() {
    this.shareFormService.changedOrder.subscribe((orderDetails: OrderDetails) => {
      this.orderDetails = orderDetails;
      this.bags = orderDetails.bags;
    });
    this.shareFormService.changedPersonalData.subscribe((personalData: PersonalData) => {
      this.personalData = personalData;
    });
  }
}
