import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUserInfo } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnInit, OnDestroy {
  userInfo: IUserInfo;
  customerInfoForm: FormGroup;
  customerName: FormControl;
  totalUserViolations: number;
  userViolationForCurrentOrder: number;
  orderId = 893;
  public currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private localStorageService: LocalStorageService, private orderService: OrderService) {}

  public initForm(): void {
    this.customerInfoForm = new FormGroup({
      customerName: new FormControl('', [Validators.required]),
      customerPhoneNumber: new FormControl('', [Validators.required]),
      customerEmail: new FormControl('', [Validators.required, Validators.email]),
      recipientName: new FormControl('', [Validators.required]),
      recipientPhoneNumber: new FormControl('', [Validators.required]),
      recipientEmail: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public patchFormData(): void {
    this.customerInfoForm.patchValue(this.userInfo);
  }

  public getUserInfo() {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.orderService
      .getUserInfo(this.orderId, this.currentLanguage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: IUserInfo) => {
        this.userInfo = data;
        this.totalUserViolations = data.totalUserViolations;
        this.userViolationForCurrentOrder = data.userViolationForCurrentOrder;
        this.patchFormData();
      });
  }

  ngOnInit(): void {
    this.initForm();
    this.getUserInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
