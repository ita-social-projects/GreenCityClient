import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { IExportDetails } from '../../models/ubs-admin.interface';
import { fromSelect, toSelect } from '../ubs-admin-table/table-cell-time/table-cell-time-range';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
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
  exportInfo: IExportDetails;
  ordersForm: FormGroup;

  constructor(private fb: FormBuilder, private localStorageService: LocalStorageService, private translate: TranslateService) {}
  setExportTime() {
    this.showTimePicker = true;
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
  }
  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.currentLanguage = lang;
      this.translate.setDefaultLang(lang);
    });
  }
  initForm() {
    // const currentEmployees = this.responsiblePersonInfo.currentPositionEmployees;
    // this.overpayment = 0;
    this.ordersForm = this.fb.group({
      exportDetailsDto: this.fb.group({
        dateExport: this.exportInfo.dateExport ? formatDate(this.exportInfo.dateExport, 'yyyy-MM-dd', this.currentLanguage) : '',
        timeDeliveryFrom: this.parseTimeToStr(this.exportInfo.timeDeliveryFrom),
        timeDeliveryTo: this.parseTimeToStr(this.exportInfo.timeDeliveryTo),
        receivingStation: this.exportInfo.receivingStation
      }),

      responsiblePersonsForm: this.fb.group({
        callManager: null,
        logistician: null,
        navigator: null,
        driver: null
      })
    });
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
  }

  cancel() {
    this.fromInput = this.from;
    this.toInput = this.to;
    this.showTimePicker = false;
  }
  parseTimeToStr(dateStr: string) {
    return dateStr ? formatDate(dateStr, 'HH:mm', this.currentLanguage) : '';
  }
}
