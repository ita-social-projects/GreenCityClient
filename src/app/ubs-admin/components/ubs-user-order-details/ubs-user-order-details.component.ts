import { Component, Input, OnInit } from '@angular/core';
import { UserOrdersService } from '../../services/user-orders.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();

  @Input()
  id: number;

  orderDetails: any;
  public currentLanguage: string;
  loading = false;

  constructor(private userOrdersService: UserOrdersService) {}

  ngOnInit() {
    this.loading = true;
    // this.currentLanguage = localStorage.getItem('language');
    this.userOrdersService
      .getOrderDetails(this.id)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        // this.orderDetails = item.bags.filter((value) => value.code === this.currentLanguage);
        this.orderDetails = item[this.id - 1];
        this.loading = false;
      });
  }
}
