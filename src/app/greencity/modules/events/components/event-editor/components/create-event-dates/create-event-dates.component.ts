import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-create-event-dates',
  templateUrl: './create-event-dates.component.html',
  styleUrls: ['./create-event-dates.component.scss']
})
export class CreateEventDatesComponent {
  @Input() eventDateForm: FormArray;
}
