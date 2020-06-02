import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stat-row',
  templateUrl: './stat-row.component.html',
  styleUrls: ['./stat-row.component.scss']
})
export class StatRowComponent implements OnInit {

  // TODO Replace with entity
  @Input() stat: { action, caption, count, question, iconPath, locationText };
  @Input() index: number;

  readonly locationImage = 'assets/img/icon/location-icon.png';

  constructor() { }

  ngOnInit() { }
}
