import { Component, Inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TariffsService } from '../../../../services/tariffs.service';
import { Bag } from '../../../../models/tariffs.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-tariffs-add-tariff-service-pop-up',
  templateUrl: './ubs-admin-tariffs-add-tariff-service-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-tariff-service-pop-up.component.scss']
})
export class UbsAdminTariffsAddTariffServicePopUpComponent implements OnInit {
  addTariffServiceForm: FormGroup;
  receivedData;
  tariffService: Bag;
  loadingAnim: boolean;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public icons = {
    close: './assets/img/icon/sign-in/close-btn.svg'
  };
  namePattern = /^[А-Яа-яЯїЇіІєЄёЁ ]+$/;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddTariffServicePopUpComponent>
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.initForm();
    this.fillFields(this.receivedData);
  }

  private initForm(): void {
    this.addTariffServiceForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      capacity: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      commission: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      description: new FormControl('', [Validators.required])
    });
  }

  addNewTariffForService() {
    const { name, capacity, price, commission, description } = this.addTariffServiceForm.value;
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

  editTariffForService(receivedData) {
    const langCode = receivedData.bagData.languageCode;
    const { name, capacity, price, commission, description } = this.addTariffServiceForm.value;
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

  fillFields(receivedData) {
    if (this.receivedData.bagData) {
      const { name, price, capacity, commission, description } = this.receivedData.bagData;
      this.addTariffServiceForm.patchValue({
        name,
        price,
        capacity,
        commission,
        description
      });
    }
  }
}
