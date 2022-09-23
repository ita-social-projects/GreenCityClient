import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import {
  IResponsiblePersonsData,
  IUpdateExportDetails,
  IUpdateResponsibleEmployee,
  FormFieldsName,
  IDataForPopUp
} from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-several-orders-pop-up',
  templateUrl: './ubs-admin-several-orders-pop-up.component.html',
  styleUrls: ['./ubs-admin-several-orders-pop-up.component.scss']
})
export class UbsAdminSeveralOrdersPopUpComponent implements OnInit, OnDestroy {
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
  public closestAvailableDate: string;
  public isCurrentDaySelected: boolean;
  public dateExportInputSubs: Subscription;

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
    this.closestAvailableDate = this.getClosestAvailableDate();
    this.initListeners();
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

  initListeners(): void {
    const exportDetailsDtoGroup = this.ordersForm.get('exportDetailsDto');
    const dateExportInput = exportDetailsDtoGroup.get('dateExport');
    const timeFromInput = exportDetailsDtoGroup.get(FormFieldsName.TimeDeliveryFrom);
    const timeToInput = exportDetailsDtoGroup.get(FormFieldsName.TimeDeliveryTo);

    this.dateExportInputSubs = dateExportInput.valueChanges.subscribe((date) => {
      this.isCurrentDaySelected = date === this.currentDate;
      if (!this.isCurrentDaySelected) {
        return;
      }

      const selectedTimeFrom: string | null = timeFromInput?.value;
      if (selectedTimeFrom && !this.isSelectedTimeValid(selectedTimeFrom)) {
        timeFromInput.reset();
        timeToInput.reset();
      }
    });
  }

  getClosestAvailableDate(): string {
    const lastTimeFromOption = '21:30';
    const isCurrentWorkingDayOver = !this.isSelectedTimeValid(lastTimeFromOption);

    if (isCurrentWorkingDayOver) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date.toISOString().split('T')[0];
    } else {
      return this.currentDate;
    }
  }

  isSelectedTimeValid(timeString: string): boolean {
    const currHour: number = new Date().getHours();
    const currMinute: number = new Date().getMinutes();
    const selectedTime: string[] = timeString.split(':');
    const selectedHour: number = Number(selectedTime[0]);
    const selectedMinute: number = Number(selectedTime[1]);

    return currHour < selectedHour || (currHour === selectedHour && currMinute < selectedMinute) || false;
  }

  showTimePickerClick(): void {
    this.showTimePicker = true;
  }

  formAction(groupName: string, fieldName: string, data?: string): void {
    this.ordersForm.get(groupName).get(fieldName).setValue(data);
    this.ordersForm.get(groupName).get(fieldName).markAsDirty();
    this.ordersForm.get(groupName).get(fieldName).markAsTouched();
  }

  setExportTime(data: any): void {
    this.formAction('exportDetailsDto', FormFieldsName.TimeDeliveryFrom, data.from);
    this.formAction('exportDetailsDto', FormFieldsName.TimeDeliveryTo, data.to);
    this.fromInput = this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryFrom).value;
    this.toInput = this.ordersForm.get('exportDetailsDto').get(FormFieldsName.TimeDeliveryTo).value;
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
    return this.dataFromTable.find((element) => element.title === position).arrayData.map((e) => e.ua);
  }

  getFilledEmployeeData(responsibleEmployee: string, responiblePersonId: number, positionName: string): IUpdateResponsibleEmployee {
    const newEmployee: IUpdateResponsibleEmployee = {
      employeeId: 0,
      positionId: responiblePersonId
    };
    const employeeId = this.dataFromTable
      .find((e) => e.title === positionName)
      .arrayData.find((element) => element.ua === responsibleEmployee).key;
    newEmployee.employeeId = Number(employeeId);
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
    responsibleProps.forEach((item: string) =>
      arrEmployees.push(this.getFilledEmployeeData(responsibleEmployeeData[item], this.orderService.matchProps(item), item))
    );
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

  getReceivingStationId(receivingStationName: string): number {
    const receivingStationId = this.dataFromTable
      .find((e) => e.title === FormFieldsName.ReceivingStation)
      .arrayData.find((element) => element.ua === receivingStationName).key;
    return Number(receivingStationId);
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

  ngOnDestroy(): void {
    this.dateExportInputSubs.unsubscribe();
  }
}
