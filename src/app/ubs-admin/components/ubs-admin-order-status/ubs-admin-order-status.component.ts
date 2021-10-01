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
      .getOrderDetailStatus(this.order.orderid)
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
