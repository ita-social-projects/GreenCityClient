import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserOrdersService } from '../../services/user-orders.service';
import { IOrderData } from '../models/IOrderData.interface';

@Component({
  selector: 'app-ubs-user-order-cancel-pop-up',
  templateUrl: './ubs-user-order-cancel-pop-up.component.html',
  styleUrls: ['./ubs-user-order-cancel-pop-up.component.scss']
})
export class UbsUserOrderCancelPopUpComponent implements OnInit {
  constructor(private userOrdersService: UserOrdersService, @Inject(MAT_DIALOG_DATA) public data: IOrderData) {}

  ngOnInit(): void {}

  public deleteCard() {}
}
