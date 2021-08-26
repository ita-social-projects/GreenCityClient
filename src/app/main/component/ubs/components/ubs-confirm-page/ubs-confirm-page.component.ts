import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ubs-confirm-page',
  templateUrl: './ubs-confirm-page.component.html',
  styleUrls: ['./ubs-confirm-page.component.scss']
})
export class UbsConfirmPageComponent implements OnInit {
  orderId: string;
  responseStatus: string;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.orderId = params.order_id;
      this.responseStatus = params.response_status;
    });
  }
}
