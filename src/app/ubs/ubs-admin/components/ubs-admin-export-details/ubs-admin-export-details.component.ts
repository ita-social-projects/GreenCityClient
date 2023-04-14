import { formatDate } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IExportDetails } from '../../models/ubs-admin.interface';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { OrderService } from '../../services/order.service';

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
  public currentHour: string;
  public allReceivingStations: string[];
  public currentDate: string;
  public isOrderStatusCancelOrDone = false;
  public resetFieldImg = './assets/img/ubs-tariff/bigClose.svg';
  private statuses = [OrderStatus.BROUGHT_IT_HIMSELF, OrderStatus.CANCELED, OrderStatus.FORMED];

  constructor(private cdr: ChangeDetectorRef, public orderService: OrderService) {}

  ngAfterViewChecked(): void {
    const isFormRequired = !this.orderService.isStatusInArray(this.orderStatus, this.statuses);
    const everyFieldFilled = Object.keys(this.exportDetailsDto.controls).every((key) => !!this.exportDetailsDto.get(key).value);
    const someFieldFilled = Object.keys(this.exportDetailsDto.controls).some((key) => !!this.exportDetailsDto.get(key).value);
    const hasNotValidFields = (everyFieldFilled && !someFieldFilled) || (!everyFieldFilled && someFieldFilled);

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

    if (this.orderStatus === OrderStatus.CANCELED || this.orderStatus === OrderStatus.DONE) {
      this.isOrderStatusCancelOrDone = true;
    }

    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.initTime();
    this.allReceivingStations = this.exportInfo.allReceivingStations.map((e) => e.name);
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  public resetValue(): void {
    this.exportDetailsDto.get('receivingStationId').setValue(null);
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  public isFormRequired(): boolean {
    const isNotOpen = !this.pageOpen;
    const isNotValid = !this.exportDetailsDto.valid;
    const isNotCancelOrDone = !this.isOrderStatusCancelOrDone;

    return isNotOpen && isNotValid && isNotCancelOrDone;
  }

  showTimePickerClick(): void {
    this.showTimePicker = true;
    this.fromInput = this.exportDetailsDto.get('timeDeliveryFrom').value;
    this.toInput = this.exportDetailsDto.get('timeDeliveryTo').value;
  }

  checkDate(event: any): void {
    if (this.currentDate === event.target.value && this.currentHour > this.exportDetailsDto.value.timeDeliveryFrom) {
      this.exportDetailsDto.get('timeDeliveryFrom').setValue('');
      this.exportDetailsDto.get('timeDeliveryTo').setValue('');
    }
  }

  getExportDate(): string {
    return this.exportDetailsDto.get('dateExport').value;
  }

  setExportTime(data: any): void {
    this.exportDetailsDto.get('timeDeliveryFrom').setValue(data.from);
    this.exportDetailsDto.get('timeDeliveryTo').setValue(data.to);
    this.exportDetailsDto.get('timeDeliveryFrom').markAsDirty();
    this.exportDetailsDto.get('timeDeliveryTo').markAsDirty();
    this.showTimePicker = false;
  }

  initTime(): void {
    this.currentHour = Date.now().toString();
    this.currentHour = formatDate(this.currentHour, 'HH:mm', 'en-US');
  }

  isTimeValid(): boolean {
    return this.exportDetailsDto.get('timeDeliveryFrom').invalid || this.exportDetailsDto.get('timeDeliveryTo').invalid;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
