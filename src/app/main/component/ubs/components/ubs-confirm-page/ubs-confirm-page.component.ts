import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ubs-confirm-page',
  templateUrl: './ubs-confirm-page.component.html',
  styleUrls: ['./ubs-confirm-page.component.scss']
})
export class UbsConfirmPageComponent {
  orderId: string;
  responseStatus: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.orderId = params.order_id;
      this.responseStatus = params.response_status;
    });
  }
}
