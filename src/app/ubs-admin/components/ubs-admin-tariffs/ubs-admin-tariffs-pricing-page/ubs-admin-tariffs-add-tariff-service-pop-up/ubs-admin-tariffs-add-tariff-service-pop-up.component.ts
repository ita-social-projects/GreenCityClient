import { Component, Inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TariffsService } from '../../../../services/tariffs.service';
import { Bag } from '../../../../models/tariffs.interface';
import { Subject } from 'rxjs';
import { CreateEditTariffsServicesFormBuilder } from '../../../../services/create-edit-tariffs-service-form-builder';

@Component({
  selector: 'app-ubs-admin-tariffs-add-tariff-service-pop-up',
  templateUrl: './ubs-admin-tariffs-add-tariff-service-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-tariff-service-pop-up.component.scss']
})
export class UbsAdminTariffsAddTariffServicePopUpComponent implements OnInit {
  addTariffServiceForm: FormGroup;
  slide = false;
  receivedData;
  tariffService: Bag;
  loadingAnim: boolean;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public icons = {
    close: './assets/img/icon/sign-in/close-btn.svg'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddTariffServicePopUpComponent>,
    private fb: FormBuilder,
    private formBuilder: CreateEditTariffsServicesFormBuilder
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.initForm();
    this.fillFields(this.receivedData);
  }

  private initForm(): void {
    this.receivedData.bagData ? this.editForm() : this.addForm();
  }

  addForm(): void {
    this.addTariffServiceForm = this.formBuilder.createTariffService();
  }

  editForm(): void {
    this.addTariffServiceForm = this.fb.group({
      name: new FormControl({ value: this.receivedData.bagData.name, disabled: true }),
      capacity: new FormControl({ value: this.receivedData.bagData.capacity, disabled: true }),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      description: new FormControl({ value: this.receivedData.bagData.description, disabled: true }),
      commission: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')])
    });
  }

  addNewTariffForService() {
    const locationId = this.receivedData.locationId;
    const { name, nameEn, capacity, price, commission, description, descriptionEn } = this.addTariffServiceForm.value;
    this.tariffService = {
      capacity,
      price,
      locationId,
      commission,
      tariffTranslationDtoList: [
        {
          description,
          languageId: 1,
          name
        },
        {
          description: descriptionEn,
          languageId: 2,
          name: nameEn
        }
      ]
    };
    this.loadingAnim = true;
    this.tariffsService
      .createNewTariffForService(this.tariffService)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close({});
      });
  }

  editTariffForService(receivedData) {
    const langCode = receivedData.bagData.languageCode;
    const { name, capacity, price, commission, description } = this.addTariffServiceForm.getRawValue();
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
