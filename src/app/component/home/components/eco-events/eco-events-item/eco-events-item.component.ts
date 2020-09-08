import { Component, Input, OnInit } from '@angular/core';
import { NewsDto } from '../../../models/NewsDto';

@Component({
  selector: 'app-eco-events-item',
  templateUrl: './eco-events-item.component.html',
  styleUrls: ['./eco-events-item.component.scss']
})
export class EcoEventsItemComponent implements OnInit {
  @Input() public ecoEvent: NewsDto;
  @Input() public mainEvent = false;
  readonly arrow = 'assets/img/icon/arrow.png';

  constructor() { }

  ngOnInit() {
  }

}
