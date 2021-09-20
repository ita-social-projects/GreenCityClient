import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-user-order-details',
  templateUrl: './ubs-user-order-details.component.html',
  styleUrls: ['./ubs-user-order-details.component.scss']
})
export class UbsUserOrderDetailsComponent implements OnInit {
  destroy: Subject<boolean> = new Subject<boolean>();

  @Input()
  order: any;

  constructor() {}

  ngOnInit() {}
}
