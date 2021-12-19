import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserOrdersService } from '../../services/user-orders.service';
import { IOrderData } from '../models/IOrderData.interface';

@Component({
  selector: 'app-ubs-user-order-cancel-pop-up',
  templateUrl: './ubs-user-order-cancel-pop-up.component.html',
  styleUrls: ['./ubs-user-order-cancel-pop-up.component.scss']
})
export class UbsUserOrderCancelPopUpComponent {
  constructor(private userOrdersService: UserOrdersService, @Inject(MAT_DIALOG_DATA) public data: IOrderData) {}

  public deleteCard(): void {
    this.userOrdersService.deleteOrder(this.data.orderId).subscribe();
    this.data.orders = this.data.orders.filter((order) => order.generalOrderInfo.id !== this.data.orderId);
  }
}
