import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ubs-submit-order-notification',
  templateUrl: './ubs-submit-order-notification.component.html',
  styleUrls: ['./ubs-submit-order-notification.component.scss']
})
export class UbsSubmitOrderNotificationComponent implements OnInit {
  public isNotification = true;
  orderId: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.orderId = +this.route.snapshot.paramMap.get('orderId');
    });
  }
}
