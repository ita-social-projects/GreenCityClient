import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-address-details',
  templateUrl: './ubs-admin-address-details.component.html',
  styleUrls: ['./ubs-admin-address-details.component.scss']
})
export class UbsAdminAddressDetailsComponent implements OnDestroy {
  @Input() order;
  @Input() addressDetailsForm: FormGroup;
  pageOpen: boolean;

  constructor(public orderService: OrderService) {}
  private destroy$: Subject<boolean> = new Subject<boolean>();

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
