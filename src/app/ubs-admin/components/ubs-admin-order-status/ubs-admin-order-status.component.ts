import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IGeneralOrderInfo } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnInit {
  @Input() orderStatusForm: FormGroup;
  @Input() generalOrderInfo: IGeneralOrderInfo;
  @Output() changed = new EventEmitter<string>();

  constructor(public orderService: OrderService) {}
  public availableOrderStatuses;

  ngOnInit() {
    this.availableOrderStatuses = this.orderService.getAvailableOrderStatuses(
      this.generalOrderInfo.orderStatus,
      this.generalOrderInfo.orderStatusesDtos
    );
  }

  onChangedOrderStatus(statusName: string) {
    this.changed.emit(statusName);
  }
}
