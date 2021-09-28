import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent implements OnInit {
  @Input()
  order: any;

  constructor() {}

  ngOnInit() {}
}
