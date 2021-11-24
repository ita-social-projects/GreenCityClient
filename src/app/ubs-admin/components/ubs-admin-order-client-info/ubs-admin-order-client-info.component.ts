import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddViolationsComponent } from '../add-violations/add-violations.component';
import { IUserInfo } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnInit, OnDestroy {
  @Input() clientInfo: IUserInfo;
  @Input() clientInfoForm: FormGroup;
  @Input() orderId;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  public userViolationForCurrentOrder: number;

  constructor(private dialog: MatDialog, private orderService: OrderService) {}

  ngOnInit() {
    this.pageOpen = true;
    this.getUserInfo();
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getUserInfo() {
    const lang = 'ua';
    this.orderService
      .getUserInfo(this.orderId, lang)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.userViolationForCurrentOrder = data.userViolationForCurrentOrder;
      });
  }

  openModal(): void {
    this.dialog.open(AddViolationsComponent, {
      height: '90%',
      maxWidth: '560px',
      data: {
        id: this.orderId
      }
    });
  }
}
