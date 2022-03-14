import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { fromSelect, toSelect } from '../ubs-admin-table/table-cell-time/table-cell-time-range';

@Component({
  selector: 'app-ubs-admin-several-orders-pop-up',
  templateUrl: './ubs-admin-several-orders-pop-up.component.html',
  styleUrls: ['./ubs-admin-several-orders-pop-up.component.scss']
})
export class UbsAdminSeveralOrdersPopUpComponent implements OnInit {
  currentLanguage: string;
  public showTimePicker = false;
  public fromSelect: string[];
  public toSelect: string[];
  public fromInput: string;
  public toInput: string;
  public from: string;
  public to: string;
  public allCallManagers: string[];
  public allLogisticians: string[];
  public allNavigators: string[];
  public allDrivers: string[];
  public receivingStations: string;
  ordersForm: FormGroup;

  @Input() dataFromTable;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UbsAdminSeveralOrdersPopUpComponent>) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.ordersForm = this.fb.group({
      exportDetailsDto: this.fb.group({
        dateExport: [null, [Validators.required]],
        timeDeliveryFrom: [null, [Validators.required]],
        timeDeliveryTo: [null, [Validators.required]],
        receivingStation: [null, [Validators.required]]
      }),

      responsiblePersonsForm: this.fb.group({
        callManager: [null, [Validators.required]],
        logistician: [null, [Validators.required]],
        navigator: [null, [Validators.required]],
        driver: [null, [Validators.required]]
      })
    });
    this.setEmployeesByPosition();
  }
  parseDataFromOrdersTable(name: string): void {
    switch (name) {
      case 'receivingStation':
        this.receivingStations = this.dataFromTable.filter((el) => el.title.key === 'receivingStation').checked;
        break;
    }
  }
  setExportTime() {
    this.showTimePicker = true;
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
    this.fromInput = this.ordersForm.get('exportDetailsDto').get('timeDeliveryFrom').value;
    this.toInput = this.ordersForm.get('exportDetailsDto').get('timeDeliveryTo').value;
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
      this.ordersForm.get('exportDetailsDto').get('timeDeliveryFrom').setValue(this.fromInput);
      this.ordersForm.get('exportDetailsDto').get('timeDeliveryTo').setValue(this.toInput);
      this.ordersForm.get('exportDetailsDto').get('timeDeliveryFrom').markAsDirty();
      this.ordersForm.get('exportDetailsDto').get('timeDeliveryTo').markAsDirty();
      this.showTimePicker = false;
    }
    console.log(this.from, this.to);
    console.log(this.dataFromTable);
    console.log(this.allNavigators);
  }

  cancel() {
    this.fromInput = this.from;
    this.toInput = this.to;
    this.showTimePicker = false;
  }
  parseTimeToStr(dateStr: string) {
    return dateStr ? formatDate(dateStr, 'HH:mm', this.currentLanguage) : '';
  }
  setEmployeesByPosition(): void {
    this.receivingStations = this.getEmployeesByPosition('receivingStation');
    this.allCallManagers = this.getEmployeesByPosition('responsibleCaller');
    this.allLogisticians = this.getEmployeesByPosition('responsibleLogicMan');
    this.allNavigators = this.getEmployeesByPosition('responsibleNavigator');
    this.allDrivers = this.getEmployeesByPosition('responsibleDriver');
  }

  getEmployeesByPosition(position: string): any {
    let data: string[];
    this.dataFromTable.map((element) => {
      return element.title === position ? (data = element.arrayData.map((el) => el.ua)) : [];
    });
    return data;
  }
  public onSubmit(): void {}
  cancelPopUp() {
    this.ordersForm.reset();
    this.dialogRef.close();
  }
}
