import { Component, Inject, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TariffsService } from '../../../../services/tariffs.service';
import { Bag } from '../../../../models/tariffs.interface';
import { Subject } from 'rxjs';
import { CreateEditTariffsServicesFormBuilder } from '../../../../services/create-edit-tariffs-service-form-builder';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Patterns } from 'src/assets/patterns/patterns';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';

@Component({
  selector: 'app-ubs-admin-tariffs-add-tariff-service-pop-up',
  templateUrl: './ubs-admin-tariffs-add-tariff-service-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-tariff-service-pop-up.component.scss']
})
export class UbsAdminTariffsAddTariffServicePopUpComponent implements OnInit {
  addTariffServiceForm: FormGroup;
  slide = false;
  receivedData;
  tariffs;
  tariffService: Bag;
  loadingAnim: boolean;
  private destroy: Subject<boolean> = new Subject<boolean>();
  name: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddTariffServicePopUpComponent>,
    private fb: FormBuilder,
    private formBuilder: CreateEditTariffsServicesFormBuilder,
    private localeStorageService: LocalStorageService
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
    this.initForm();
    this.fillFields(this.receivedData);
    this.tariffsService.setAllTariffsForService();
  }

  private initForm(): void {
    this.receivedData.bagData ? this.editForm() : this.addForm();
  }

  addForm(): void {
    this.addTariffServiceForm = this.formBuilder.createTariffService();
  }

  editForm(): void {
    this.addTariffServiceForm = this.fb.group({
      name: new FormControl({ value: this.receivedData.bagData.name }),
      nameEng: new FormControl({ value: this.receivedData.bagData.nameEng }),
      capacity: new FormControl({ value: this.receivedData.bagData.capacity }),
      price: new FormControl('', [Validators.required, Validators.pattern(Patterns.ubsPrice)]),
      description: new FormControl({ value: this.receivedData.bagData.description }),
      descriptionEng: new FormControl(this.receivedData.bagData.descriptionEng),
      commission: new FormControl('', [Validators.required, Validators.pattern(Patterns.ubsPrice)])
    });
  }

  createAndStoreNewTariff() {
    this.addNewTariffForService();
    this.tariffsService.setAllTariffsForService();
  }

  addNewTariffForService() {
    const locationId = this.receivedData.locationId;
    const { name, nameEng, capacity, price, commission, description, descriptionEng } = this.addTariffServiceForm.value;

    this.tariffService = {
      capacity,
      price,
      locationId,
      commission,
      tariffTranslationDtoList: [
        {
          name,
          description,
          descriptionEng,
          nameEng
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

    this.loadingAnim = false;
  }

  editTariffForService(receivedData) {
    const langCode = receivedData.bagData.languageCode;
    const { name, capacity, price, commission, description, descriptionEng } = this.addTariffServiceForm.getRawValue();
    this.tariffService = {
      name,
      capacity,
      price,
      commission,
      description,
      descriptionEng,
      langCode
    };
    this.loadingAnim = true;
    this.tariffsService
      .editTariffForService(receivedData.bagData.id, this.tariffService)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close({});
      });
    this.loadingAnim = false;
  }

  fillFields(receivedData) {
    if (this.receivedData.bagData) {
      const { name, nameEng, price, capacity, commission, description } = this.receivedData.bagData;
      this.addTariffServiceForm.patchValue({
        name,
        nameEng,
        price,
        capacity,
        commission,
        description
      });
    }
  }

  onCancel(): void {
    const matDialogRef = this.dialog.open(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        name: 'cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
    matDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dialogRef.close();
      }
    });
  }
}
