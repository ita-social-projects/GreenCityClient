import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bag, Bags } from '../../models/ubs-admin.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-order-details-form',
  templateUrl: './ubs-admin-order-details-form.component.html',
  styleUrls: ['./ubs-admin-order-details-form.component.scss']
})
export class UbsAdminOrderDetailsFormComponent implements OnInit, OnDestroy {
  payMore = true;
  isInputDisabled = false;
  isVisible = true;
  ubsCourier = 0;
  orderDetailsForm: FormGroup;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public currentLanguage: string;

  bags: Bag[];
  points: number;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.takeBagsData();
  }

  initForm() {
    this.orderDetailsForm = this.fb.group({
      plannedQuantity: new FormControl({value: '1', disabled: true}),
      approvedQuantity: new FormControl(''),
      exportedQuantity: new FormControl(''),
      storeOrderNumber: new FormControl('', [Validators.minLength(8)]),
      certificate: new FormControl('', [Validators.minLength(8)]),
      customerComment: new FormControl('')
    });
  }

  takeBagsData() {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.orderService
      .getBags(this.currentLanguage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Bags) => {
        this.bags = data.bags;
        this.points = data.points;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
