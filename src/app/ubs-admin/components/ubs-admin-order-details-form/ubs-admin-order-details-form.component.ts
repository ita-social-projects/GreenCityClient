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
  public payMore = true;
  public isInputDisabled = false;
  public isVisible = true;
  public ubsCourier = 0;
  public orderDetailsForm: FormGroup;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public currentLanguage: string;
  pageOpen: boolean;
  public bags: Bag[];
  public points: number;

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.initForm();
    this.takeBagsData();
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  public initForm(): void {
    this.orderDetailsForm = this.fb.group({
      plannedQuantity: new FormControl({ value: '1', disabled: true }),
      approvedQuantity: new FormControl(''),
      exportedQuantity: new FormControl(''),
      storeOrderNumber: new FormControl('', [Validators.minLength(8)]),
      certificate: new FormControl('', [Validators.minLength(8)]),
      customerComment: new FormControl('')
    });
  }

  public takeBagsData(): void {
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
