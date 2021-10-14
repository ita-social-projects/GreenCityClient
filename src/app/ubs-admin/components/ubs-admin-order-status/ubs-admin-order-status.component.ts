import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnInit, OnDestroy {
  @Input() order;
  @Input() orderStatusForm: FormGroup;

  orderStatuses = [
    { name: 'FORMED', translation: 'order-edit.order-status.formed' },
    { name: 'ADJUSTMENT', translation: 'order-edit.order-status.adjustment' },
    { name: 'BROUGHT_IT_HIMSELF', translation: 'order-edit.order-status.brought-it-himself' },
    { name: 'CONFIRMED', translation: 'order-edit.order-status.confirmed' },
    { name: 'ON_THE_ROUTE', translation: 'order-edit.order-status.on-the-route' },
    { name: 'DONE', translation: 'order-edit.order-status.done' },
    { name: 'NOT_TAKEN_OUT', translation: 'order-edit.order-status.not-taken-out' },
    { name: 'CANCELLED', translation: 'order-edit.order-status.cancelled' }
  ];

  paymentStatuses = [
    { name: 'UNPAID', translation: 'order-edit.payment-status.not-paid' },
    { name: 'PAID', translation: 'order-edit.payment-status.paid' }
  ];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
