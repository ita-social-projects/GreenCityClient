import { Component, Input } from '@angular/core';
import { NewsDto } from '@home-models/NewsDto';

@Component({
  selector: 'app-eco-events-item',
  templateUrl: './eco-events-item.component.html',
  styleUrls: ['./eco-events-item.component.scss']
})
export class EcoEventsItemComponent {
  @Input() public ecoEvent: NewsDto;
  @Input() public mainEvent = false;
  readonly arrow = 'assets/img/icon/arrow.png';
}
