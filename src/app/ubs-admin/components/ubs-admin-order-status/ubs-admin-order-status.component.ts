import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { IDetailStatus } from '../../models/ubs-admin.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnInit, OnDestroy {
  @Input() order;
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

  public detailStatusForm: FormGroup;
  public detailStatus: IDetailStatus;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnInit(): void {
    this.initForm();
    this.getOrderDetailStatus();
  }

  public initForm(): void {
    this.detailStatusForm = this.fb.group({
      date: [''],
      orderStatus: this.fb.array([]),
      paymentStatus: this.fb.array([])
    });
  }

  public patchFormData(): void {
    this.detailStatusForm.patchValue(this.detailStatus);
  }

  public getOrderDetailStatus(): void {
    this.orderService
      .getOrderDetailStatus(this.order.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: IDetailStatus) => {
        this.detailStatus = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
