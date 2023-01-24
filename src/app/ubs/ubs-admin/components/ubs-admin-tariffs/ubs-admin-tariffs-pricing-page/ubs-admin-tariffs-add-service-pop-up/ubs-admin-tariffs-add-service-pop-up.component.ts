import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TariffsService } from '../../../../services/tariffs.service';
import { Service } from '../../../../models/tariffs.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CreateEditTariffsServicesFormBuilder } from '../../../../services/create-edit-tariffs-service-form-builder';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-ubs-admin-tariffs-add-service-pop-up',
  templateUrl: './ubs-admin-tariffs-add-service-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-service-pop-up.component.scss']
})
export class UbsAdminTariffsAddServicePopUpComponent implements OnInit, OnDestroy {
  service: Service;
  date: string;
  user: string;
  receivedData;
  loadingAnim: boolean;
  addServiceForm: FormGroup;
  private destroy: Subject<boolean> = new Subject<boolean>();
  name: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddServicePopUpComponent>,
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
  }

  private initForm() {
    this.receivedData.serviceData ? this.editForm() : this.addForm();
  }

  addForm(): void {
    this.addServiceForm = this.formBuilder.createTariffService();
  }

  editForm(): void {
    this.addServiceForm = this.fb.group({
      name: new FormControl({ value: this.receivedData.serviceData.name }),
      nameEng: new FormControl({ value: this.receivedData.serviceData.nameEng }),
      price: new FormControl('', [Validators.required, Validators.pattern(Patterns.ubsPrice)]),
      description: new FormControl({ value: this.receivedData.serviceData.description }),
      descriptionEng: new FormControl(this.receivedData.serviceData.descriptionEng)
    });
  }

  async addNewService() {
    const tariffId = this.receivedData.tariffId;

    const { name, nameEng, price, description, descriptionEng } = this.addServiceForm.value;
    this.service = {
      price,
      tariffId,
      description,
      descriptionEng,
      name,
      nameEng
    };
    this.loadingAnim = true;
    this.tariffsService
      .createService(this.service)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  fillFields(receivedData) {
    if (receivedData.serviceData) {
      const { name, nameEng, price, description, englishDescription } = this.receivedData.serviceData;
      this.addServiceForm.patchValue({
        name,
        nameEng,
        price,
        description,
        englishDescription
      });
    }
  }

  editService() {
    const id = this.receivedData.serviceData.id;
    const { name, nameEng, price, description, descriptionEng } = this.addServiceForm.getRawValue();
    this.service = {
      name,
      nameEng,
      price,
      description,
      descriptionEng,
      id
    };
    this.loadingAnim = true;
    this.tariffsService
      .editService(this.service)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close({});
      });
    this.loadingAnim = false;
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
