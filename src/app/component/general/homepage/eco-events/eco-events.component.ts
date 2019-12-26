import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eco-events',
  templateUrl: './eco-events.component.html',
  styleUrls: ['./eco-events.component.css']
})
export class EcoEventsComponent implements OnInit {
  readonly eventImg = 'assets/img/main-event-placeholder.png';
  readonly arrow = 'assets/img/icon/arrow.png';

  constructor() { }

  ngOnInit() {
  }

}
