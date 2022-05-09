import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  event = {
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    dateTime: '2022-05-06T08:39:09.793Z',
    description: 'string',
    id: 0,
    images: 'https://st.depositphotos.com/1008244/4717/v/950/depositphotos_47178031-stock-illustration-eco-event-icon.jpg',
    organizer: {
      id: 0,
      name: 'string'
    },
    title: 'string'
  };

  list = [];

  constructor() {}

  ngOnInit(): void {}

  addEvent() {
    this.list.push(this.event);
  }
}
