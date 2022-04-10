import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  IResponsiblePersonsData,
  IUpdateExportDetails,
  IUpdateResponsibleEmployee,
  ResponsibleEmployee,
  FormFieldsName,
  IDataForPopUp
} from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { fromSelect, toSelect } from '../ubs-admin-table/table-cell-time/table-cell-time-range';

@Component({
  selector: 'app-ubs-admin-several-orders-pop-up',
  templateUrl: './ubs-admin-several-orders-pop-up.component.html',
  styleUrls: ['./ubs-admin-several-orders-pop-up.component.scss']
})
export class UbsAdminSeveralOrdersPopUpComponent implements OnInit {
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
  public receivingStations: string[];
  public currentDate: string;
  public responsiblePersonsData: IResponsiblePersonsData[];

  values = {};
  ordersForm: FormGroup;

  @Input() dataFromTable: IDataForPopUp[];
  @Input() ordersId: number[];
  @Input() currentLang: string;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<UbsAdminSeveralOrdersPopUpComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  initForm(): void {
    this.ordersForm = this.fb.group({
      exportDetailsDto: this.fb.group({
        dateExport: [null, [Validators.required]],
        timeDeliveryFrom: [null, [Validators.required]],
        timeDeliveryTo: [null, [Validators.required]],
        receivingStationId: [null, [Validators.required]]
      }),

      responsiblePersonsForm: this.fb.group({
        responsibleCaller: [null, [Validators.required]],
        responsibleLogicMan: [null, [Validators.required]],
        responsibleNavigator: [null, [Validators.required]],
        responsibleDriver: [null, [Validators.required]]
      })
    });
    this.setEmployeesByPosition();
  }

  setExportTime(): void {
    this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryFrom).markAsTouched();
    this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryTo).markAsTouched();
    this.showTimePicker = true;
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
    this.fromInput = this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryFrom).value;
    this.toInput = this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryTo).value;
  }

  onTimeFromChange(): void {
    const fromIdx = fromSelect.indexOf(this.fromInput);
    this.toSelect = toSelect.slice(fromIdx);
  }

  onTimeToChange(): void {
    const toIdx = toSelect.indexOf(this.toInput);
    this.fromSelect = fromSelect.slice(0, toIdx + 1);
  }

  save(): void {
    this.from = this.fromInput;
    this.to = this.toInput;
    if (this.fromInput && this.toInput) {
      this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryFrom).setValue(this.fromInput);
      this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryTo).setValue(this.toInput);
      this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryFrom).markAsDirty();
      this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryTo).markAsDirty();
      this.showTimePicker = false;
    }
  }

  cancel(): void {
    this.fromInput = this.from;
    this.toInput = this.to;
    this.showTimePicker = false;
  }

  parseStrToTime(dateStr: string, date: Date): string {
    const hours = dateStr.split(':')[0];
    const minutes = dateStr.split(':')[1];
    date.setHours(+hours + 2);
    date.setMinutes(+minutes);
    return date ? date.toISOString().split('Z').join('') : '';
  }

  setEmployeesByPosition(): void {
    this.receivingStations = this.getDataByColumnName(FormFieldsName.ReceivingStation);
    this.allCallManagers = this.getDataByColumnName(FormFieldsName.CallManager);
    this.allLogisticians = this.getDataByColumnName(FormFieldsName.Logistician);
    this.allNavigators = this.getDataByColumnName(FormFieldsName.Navigator);
    this.allDrivers = this.getDataByColumnName(FormFieldsName.Driver);
    this.getResponsiblePersonsData();
  }

  getDataByColumnName(position: string): string[] {
    let data: string[];
    this.dataFromTable.forEach((element) => {
      return element.title === position ? (data = element.arrayData.map((el) => el.ua)) : [];
    });
    return data;
  }
  getFilledEmployeeData(responsibleEmployee: string, responiblePersonId: number, positionName: string): IUpdateResponsibleEmployee {
    const newEmployee: IUpdateResponsibleEmployee = {
      employeeId: 0,
      positionId: responiblePersonId
    };

    this.dataFromTable.forEach((e) => {
      if (e.title === positionName) {
        e.arrayData.forEach((el) => {
          if (el.ua === responsibleEmployee) {
            newEmployee.employeeId = Number(el.key);
          }
        });
      }
    });

    return newEmployee;
  }

  public onSubmit(): void {
    const newValues: any = {};
    this.ordersForm.disable();
    newValues.orderId = this.ordersId;
    const responsibleEmployeeData = this.ordersForm.get('responsiblePersonsForm').value;
    const responsibleProps = Object.keys(responsibleEmployeeData);
    const arrEmployees: IUpdateResponsibleEmployee[] = [];
    newValues.exportDetailsDto = this.createExportDetailsDto(this.ordersForm.get('exportDetailsDto').value);
    responsibleProps.forEach((item: string) => {
      const value = responsibleEmployeeData[item];
      if (value) {
        arrEmployees.push(this.getFilledEmployeeData(value, this.matchProps(item), item));
      }
    });
    newValues.updateResponsibleEmployeeDto = arrEmployees;
    this.values = newValues;

    this.orderService.updateOrdersInfo(this.currentLang, newValues).subscribe(() => this.dialogRef.close(true));
  }

  createExportDetailsDto(exportDetails: IUpdateExportDetails): IUpdateExportDetails {
    exportDetails.receivingStationId = this.getReceivingStationId(this.ordersForm.get('exportDetailsDto').value.receivingStationId);
    exportDetails.timeDeliveryFrom = this.parseStrToTime(exportDetails.timeDeliveryFrom, new Date(exportDetails.dateExport));
    exportDetails.timeDeliveryTo = this.parseStrToTime(exportDetails.timeDeliveryTo, new Date(exportDetails.dateExport));

    return exportDetails;
  }

  matchProps(prop: string): number {
    switch (prop) {
      case FormFieldsName.CallManager:
        return ResponsibleEmployee.CallManager;
      case FormFieldsName.Driver:
        return ResponsibleEmployee.Driver;
      case FormFieldsName.Logistician:
        return ResponsibleEmployee.Logistician;
      case FormFieldsName.Navigator:
        return ResponsibleEmployee.Navigator;
    }
  }

  getReceivingStationId(receivingStationName: string): number {
    let receivingStationId = 0;
    this.dataFromTable.forEach((e) => {
      if (e.title === FormFieldsName.ReceivingStation) {
        e.arrayData.forEach((el) => {
          if (el.ua === receivingStationName) {
            receivingStationId = Number(el.key);
          }
        });
      }
    });
    return receivingStationId;
  }

  getResponsiblePersonsData(): void {
    this.responsiblePersonsData = [
      {
        translate: 'responsible-persons.call-manager',
        formControlName: FormFieldsName.CallManager,
        responsiblePersonsArray: this.allCallManagers
      },
      {
        translate: 'responsible-persons.logistician',
        formControlName: FormFieldsName.Logistician,
        responsiblePersonsArray: this.allLogisticians
      },
      {
        translate: 'responsible-persons.navigator',
        formControlName: FormFieldsName.Navigator,
        responsiblePersonsArray: this.allNavigators
      },
      {
        translate: 'responsible-persons.driver',
        formControlName: FormFieldsName.Driver,
        responsiblePersonsArray: this.allDrivers
      }
    ];
  }
}
