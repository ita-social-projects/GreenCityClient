import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IExportDetails } from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-export-details',
  templateUrl: './ubs-admin-export-details.component.html',
  styleUrls: ['./ubs-admin-export-details.component.scss']
})
export class UbsAdminExportDetailsComponent implements OnInit, OnDestroy {
  @Input() exportInfo: IExportDetails;
  @Input() exportDetailsDto: FormGroup;

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

  ngOnInit(): void {
    this.allReceivingStations = this.exportInfo.allReceivingStations.map((e) => e.name);
    this.current = new Date().toISOString().split('T')[0];
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  showTimePickerClick(): void {
    this.showTimePicker = true;
    this.fromInput = this.exportDetailsDto.get('timeDeliveryFrom').value;
    this.toInput = this.exportDetailsDto.get('timeDeliveryTo').value;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
