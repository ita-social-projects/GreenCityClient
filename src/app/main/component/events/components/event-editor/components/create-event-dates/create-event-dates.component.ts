import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBridgeService } from '../../../../services/form-bridge.service';
import { Observable, Subscription } from 'rxjs';
import { DateInformation, FormCollectionEmitter, FormEmitter } from '../../../../models/events.interface';

@Component({
  selector: 'app-create-event-dates',
  templateUrl: './create-event-dates.component.html',
  styleUrls: ['./create-event-dates.component.scss']
})
export class CreateEventDatesComponent implements OnInit, OnDestroy {
  @Input() formInput: DateInformation[];
  $days: Observable<any[]>;
  formsValue: any[] = [];
  subs: Subscription[] = [];
  @Output() formsEmit: EventEmitter<FormCollectionEmitter<DateInformation[]>> = new EventEmitter();
  protected readonly encodeURI = encodeURI;
  private _key = Symbol('key');
  private _invalidMap: Map<any, any> = new Map();

  constructor(private bridge: FormBridgeService) {}

  public checkForm({ key, valid, form, sharedKey, formKey }: FormEmitter<unknown>) {
    if (valid) {
      this._invalidMap.delete(key);
      if (!this.formsValue[sharedKey]) {
        this.formsValue[sharedKey] = {};
      }
      this.formsValue[sharedKey][formKey] = form;
      if (!this._invalidMap.size) {
        this.formsEmit.emit({ key: this._key, form: this.formsValue, valid: true });
      }
    } else {
      this._invalidMap.set(key, undefined);
      this.formsEmit.emit({ key: this._key, form: undefined, valid: false });
    }
  }

  public childrenDestroy(key: any) {
    this._invalidMap.delete(key);
    if (this._invalidMap.size) {
      this.formsEmit.emit({ key: this._key, form: this.formsValue, valid: true });
    } else {
      this.formsEmit.emit({ key: this._key, form: undefined, valid: true });
    }
  }

  ngOnInit() {
    this.formsEmit.emit({ key: this._key, form: undefined, valid: false });
    this.$days = this.bridge.$days;
    const sub = this.$days.subscribe((value) => {
      this.formsValue = this.formsValue.slice(0, value.length);
    });
    this.subs.push(sub);
    if (this.formInput) {
      const date = new Date();
      this.formInput.forEach((value) => {
        if (value.dateTime.date.getTime() <= date.getTime()) {
          value.pastDate = true;
        }
      });
      this.formsEmit.emit({ key: this._key, form: this.formInput, valid: false });
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
