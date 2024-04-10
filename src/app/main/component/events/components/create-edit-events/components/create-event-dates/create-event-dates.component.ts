import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventDateTimePickerComponent } from '../../../event-date-time-picker/event-date-time-picker.component';
import { CommonModule } from '@angular/common';
import { EventsModule } from '../../../../events.module';

@Component({
  selector: 'app-create-event-dates',
  templateUrl: './create-event-dates.component.html',
  styleUrls: ['./create-event-dates.component.scss']
})
export class CreateEventDatesComponent {
  constructor(private fb: FormBuilder) {}
  array = new Array(5);
  eventOptionsForms = this.fb.group({
    type: ['', Validators.required],
    consequent: ['', Validators.required],
    onePlace: ['', Validators.required]
  });
}
