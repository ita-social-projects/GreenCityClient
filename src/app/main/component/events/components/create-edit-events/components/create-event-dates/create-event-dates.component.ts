import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBridgeService } from '../../../../services/form-bridge.service';
import { Observable, Subscription } from 'rxjs';
import { EventsService } from '../../../../services/events.service';

@Component({
  selector: 'app-create-event-dates',
  templateUrl: './create-event-dates.component.html',
  styleUrls: ['./create-event-dates.component.scss']
})
export class CreateEventDatesComponent implements OnInit, OnDestroy {
  $days: Observable<any[]>;
  invalidMap: Map<any, boolean> = new Map();
  formsValue: any[] = [];
  subs: Subscription[] = [];
  @Output() formsEmit: EventEmitter<any> = new EventEmitter();

  constructor(
    private bridge: FormBridgeService,
    private event: EventsService
  ) {}

  subToDatesFormStatus() {
    const sub = this.bridge.$datesFormStatus.subscribe((update) => {
      const { value, key, form } = update;
      if (value) {
        this.invalidMap.delete(key);
        this.formsValue[key] = form;
        if (this.invalidMap.size === 0) {
          this.formsEmit.emit(this.formsValue);
          this.event.setDatesForm(this.formsValue);
          this.bridge.updateFormsValidStatus(true);
        }
      } else {
        if (this.invalidMap.size === 0) {
          this.bridge.updateFormsValidStatus(false);
        }
        this.invalidMap.set(key, false);
      }
    });
    this.subs.push(sub);
  }

  ngOnInit() {
    this.$days = this.bridge.$days;
    this.subToDatesFormStatus();
    this.formsValue = this.event.getDatesForm();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
