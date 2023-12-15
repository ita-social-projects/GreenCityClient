import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UserOrdersService } from '../../services/user-orders.service';
import { IUserOrderInfo } from '../models/UserOrder.interface';

@Component({
  selector: 'app-ubs-user-order-cancel-pop-up',
  templateUrl: './ubs-user-order-cancel-pop-up.component.html',
  styleUrls: ['./ubs-user-order-cancel-pop-up.component.scss']
})
export class UbsUserOrderCancelPopUpComponent {
  constructor(
    private userOrdersService: UserOrdersService,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number; orders: IUserOrderInfo[] }
  ) {}

  public deleteCard(): void {
    this.userOrdersService.deleteOrder(this.data.orderId).subscribe();
    const pos = this.data.orders.findIndex((order) => order.id === this.data.orderId);
    this.data.orders.splice(pos, 1);
  }
}
