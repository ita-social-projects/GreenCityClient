import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../models/ubs-admin.interface';
import { TariffsService } from '../../../services/tariffs.service';
import { Bag, Service } from '../../../models/tariffs.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-tariffs-add-service-popup',
  templateUrl: './ubs-admin-tariffs-add-service-popup.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-service-popup.component.scss']
})
export class UbsAdminTariffsAddServicePopupComponent implements OnInit, OnDestroy {
  tariffService: Bag;
  service: Service;
  date: string;
  user: string;
  langCode: string;
  receivedData;
  loadingAnim: boolean;
  namePattern = /^[А-Яа-яЯїЇіІєЄёЁ ]+$/;
  addServiceForm: FormGroup;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public icons = {
    close: './assets/img/icon/sign-in/close-btn.svg'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddServicePopupComponent>
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.initForm();
    this.fillFields(this.receivedData);
  }

  private initForm(): void {
    this.addServiceForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      capacity: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      commission: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      description: new FormControl('', [Validators.required])
    });
  }

  addNewTariffForService() {
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.tariffService = {
      name,
      capacity,
      price,
      commission,
      description,
      languageId: 1
    };
    this.loadingAnim = true;
    this.tariffsService
      .createNewTariffForService(this.tariffService)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialogRef.close({});
      });
  }

  addNewService() {
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.service = {
      name,
      capacity,
      price,
      commission,
      description
    };
    this.loadingAnim = true;
    this.tariffsService
      .createService(this.service)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialogRef.close({});
      });
  }

  fillFields(receivedData) {
    if (this.receivedData.bagData) {
      const { name, price, capacity, commission, description } = this.receivedData.bagData;
      this.addServiceForm.patchValue({
        name,
        price,
        capacity,
        commission,
        description
      });
    }
    if (this.receivedData.serviceData) {
      const { name, price, capacity, commission, description } = this.receivedData.serviceData;
      this.addServiceForm.patchValue({
        name,
        price,
        capacity,
        commission,
        description
      });
    }
  }

  editTariffForService(receivedData) {
    const langCode = receivedData.bagData.languageCode;
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.tariffService = {
      name,
      capacity,
      price,
      commission,
      description,
      langCode
    };
    this.loadingAnim = true;
    this.tariffsService
      .editTariffForService(receivedData.bagData.id, this.tariffService)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialogRef.close({});
      });
  }

  editService(receivedData) {
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.tariffService = {
      name,
      capacity,
      price,
      commission,
      description
    };
    this.loadingAnim = true;
    this.tariffsService
      .editService(receivedData.serviceData.id, this.tariffService)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialogRef.close({});
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
