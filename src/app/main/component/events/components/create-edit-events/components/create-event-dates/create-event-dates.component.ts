import { Component, OnInit } from '@angular/core';
import { FormBridgeService } from '../../../../services/form-bridge.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-event-dates',
  templateUrl: './create-event-dates.component.html',
  styleUrls: ['./create-event-dates.component.scss']
})
export class CreateEventDatesComponent implements OnInit {
  $days: Observable<any[]>;
  validMap: Map<any, boolean> = new Map();

  constructor(private bridge: FormBridgeService) {}

  ngOnInit() {
    this.$days = this.bridge.$days;

    this.bridge.$datesFormStatus.subscribe((value) => {
      console.log(value);
    });
  }
}
