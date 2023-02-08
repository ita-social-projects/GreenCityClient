import { Component, Input, OnDestroy, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IExportDetails } from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-export-details',
  templateUrl: './ubs-admin-export-details.component.html',
  styleUrls: ['./ubs-admin-export-details.component.scss']
})
export class UbsAdminExportDetailsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() exportInfo: IExportDetails;
  @Input() exportDetailsDto: FormGroup;
  @Input() orderStatus: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  public showTimePicker = false;
  public fromSelect: string[];
  public toSelect: string[];
  public fromInput: string;
  public toInput: string;
  public from: string;
  public to: string;
  public allReceivingStations: string[];
  public current: string;
  public resetFieldImg = './assets/img/ubs-tariff/bigClose.svg';
  private statuses = ['BROUGHT_IT_HIMSELF', 'CANCELED', 'FORMED'];

  ngAfterViewChecked(): void {
    const isFormRequired = !this.statuses.includes(this.orderStatus);

    const everyFieldFilled = Object.keys(this.exportDetailsDto.controls).every((key) => !!this.exportDetailsDto.get(key).value);
    const someFieldFilled = Object.keys(this.exportDetailsDto.controls).some((key) => !!this.exportDetailsDto.get(key).value);
    const hasNotValidFields = Number(everyFieldFilled) ^ Number(someFieldFilled);

    Object.keys(this.exportDetailsDto.controls).forEach((controlName) => {
      if (hasNotValidFields || isFormRequired) {
        this.exportDetailsDto.get(controlName).setValidators(Validators.required);
        this.exportDetailsDto.setErrors({ incorrect: true });
      } else {
        this.exportDetailsDto.setErrors(null);
        this.exportDetailsDto.get(controlName).setErrors(null);
        this.exportDetailsDto.get(controlName).clearValidators();
      }
      this.exportDetailsDto.get(controlName).updateValueAndValidity({ onlySelf: true });
      this.exportDetailsDto.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.allReceivingStations = this.exportInfo.allReceivingStations.map((e) => e.name);
    this.current = new Date().toISOString().split('T')[0];
  }

  public resetValue(): void {
    this.exportDetailsDto.get('receivingStationId').setValue(null);
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  showTimePickerClick(): void {
    this.showTimePicker = true;
    this.fromInput = this.exportDetailsDto.get('timeDeliveryFrom').value;
    this.toInput = this.exportDetailsDto.get('timeDeliveryTo').value;
  }

  setExportTime(data: any): void {
    this.exportDetailsDto.get('timeDeliveryFrom').setValue(data.from);
    this.exportDetailsDto.get('timeDeliveryTo').setValue(data.to);
    this.exportDetailsDto.get('timeDeliveryFrom').markAsDirty();
    this.exportDetailsDto.get('timeDeliveryTo').markAsDirty();
    this.showTimePicker = false;
  }

  isTimeValid(): Boolean {
    return this.exportDetailsDto.get('timeDeliveryFrom').invalid || this.exportDetailsDto.get('timeDeliveryTo').invalid;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
