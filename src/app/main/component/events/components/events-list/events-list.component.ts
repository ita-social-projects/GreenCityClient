import { MapsAPILoader } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { EventPageResponceDto, EventResponseDto } from '../../models/events.interface';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  eventsList: EventPageResponceDto[] = [];

  private geoCoder: any;

  constructor(private eventService: EventsService, private mapsAPILoader: MapsAPILoader) {}

  ngOnInit(): void {
    this.eventService.getEvents(0, 14).subscribe((res: EventResponseDto) => {
      this.eventsList = [...res.page];
      console.log(res.page);
    });

    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  getAddress(latitude: number, longitude: number): void {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      status === 'OK'
        ? results[0]
          ? results[0].formatted_address
          : window.alert('No results found')
        : window.alert('Geocoder failed due to: ' + status);
    });
  }
}
