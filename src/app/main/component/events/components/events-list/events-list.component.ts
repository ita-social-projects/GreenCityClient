import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  event = {};

  list = [];

  data: any;

  constructor() {}

  ngOnInit(): void {}

  getLocation(loc) {}
}
