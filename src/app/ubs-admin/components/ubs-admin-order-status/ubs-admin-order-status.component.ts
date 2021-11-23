import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-order-status',
  templateUrl: './ubs-admin-order-status.component.html',
  styleUrls: ['./ubs-admin-order-status.component.scss']
})
export class UbsAdminOrderStatusComponent implements OnInit {
  @Input() order;
  @Input() orderStatusForm: FormGroup;
  @Output() changed = new EventEmitter<string>();

  constructor(public orderService: OrderService) {}
  public availableOrderStatuses;

  ngOnInit() {
    this.availableOrderStatuses = this.orderService.getAvailableOrderStatuses(this.order.orderStatus);
  }

  onChangedOrderStatus(statusName: string) {
    this.changed.emit(statusName);
  }
}
