import { Component, Input, OnInit } from '@angular/core';
import { ClientOrdersService } from '../../services/client-orders.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-client-order-details',
  templateUrl: './ubs-client-order-details.component.html',
  styleUrls: ['./ubs-client-order-details.component.scss']
})
export class UbsClientOrderDetailsComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();

  @Input()
  id: number;

  orderDetails: any;
  public currentLanguage: string;
  loading = false;

  constructor(private clientOrdersService: ClientOrdersService) {}

  ngOnInit() {
    this.loading = true;
    // this.currentLanguage = localStorage.getItem('language');
    this.clientOrdersService
      .getOrderDetails(this.id)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        // this.orderDetails = item.bags.filter((value) => value.code === this.currentLanguage);
        this.orderDetails = item[this.id - 1];
        this.loading = false;
      });
  }
}
