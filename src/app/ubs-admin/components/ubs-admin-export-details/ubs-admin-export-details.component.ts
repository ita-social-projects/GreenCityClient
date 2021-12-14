import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { IExportDetails } from '../../models/ubs-admin.interface';
import { fromSelect, toSelect } from '../ubs-admin-table/table-cell-time/table-cell-time-range';

@Component({
  selector: 'app-ubs-admin-export-details',
  templateUrl: './ubs-admin-export-details.component.html',
  styleUrls: ['./ubs-admin-export-details.component.scss']
})
export class UbsAdminExportDetailsComponent implements OnInit, OnDestroy {
  @Input() exportInfo: IExportDetails;
  @Input() exportDetailsForm: FormGroup;
  @Input() from: string;
  @Input() to: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  public showTimePicker = false;
  public fromSelect: string[];
  public toSelect: string[];
  public fromInput: string;
  public toInput: string;

  ngOnInit() {
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  setExportTime() {
    this.showTimePicker = true;
  }

  onTimeFromChange() {
    const fromIdx = fromSelect.indexOf(this.fromInput);
    this.toSelect = toSelect.slice(fromIdx);
  }

  onTimeToChange() {
    const toIdx = toSelect.indexOf(this.toInput);
    this.fromSelect = fromSelect.slice(0, toIdx + 1);
  }

  save() {
    this.from = this.fromInput;
    this.to = this.toInput;
    if (this.fromInput && this.toInput) {
      this.exportDetailsForm.controls['timeDeliveryFrom'].setValue(this.fromInput);
      this.exportDetailsForm.controls['timeDeliveryTo'].setValue(this.toInput);
      this.showTimePicker = false;
    }
  }

  cancel() {
    this.fromInput = this.from;
    this.toInput = this.to;
    this.showTimePicker = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
