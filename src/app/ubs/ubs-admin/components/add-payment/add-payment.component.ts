import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { iif, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { IPaymentInfoDtos } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { DialogPopUpComponent } from '../shared/components/dialog-pop-up/dialog-pop-up.component';

interface InputData {
  orderId: number;
  viewMode: boolean;
  payment: IPaymentInfoDtos | null;
}

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit, OnDestroy {
  closeButton = './assets/img/profile/icons/cancel.svg';
  orderId: number;
  viewMode: boolean;
  editMode = false;
  isDeleting = false;
  isUploading = false;
  isWarning = false;
  isFileSizeWarning = false;
  isFileTypeWarning = false;
  payment: IPaymentInfoDtos | null;
  addPaymentForm: FormGroup;
  file;
  imagePreview: any = { src: null };
  isImageSizeError = false;
  isImageTypeError = false;
  isInitialDataChanged = false;
  isInitialImageChanged = false;
  dataSource = new MatTableDataSource();
  public date = new Date();
  public adminName;
  private maxImageSize = 10485760;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  deleteDialogData = {
    popupTitle: 'add-payment.delete-message',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no'
  };

  constructor(
    private localeStorageService: LocalStorageService,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: InputData
  ) {}

  ngOnInit(): void {
    this.orderId = this.data.orderId;
    this.viewMode = this.data.viewMode;
    this.payment = this.data.payment;
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.adminName = firstName;
    });
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroySub.next(true);
    this.destroySub.complete();
  }

  initForm() {
    this.addPaymentForm = this.fb.group({
      settlementDate: [this.payment?.settlementdate ?? '', [Validators.required]],
      amount: [this.payment?.amount ?? '', [Validators.required, Validators.pattern('^[0-9]+$')]],
      paymentId: [this.payment?.paymentId ?? '', [Validators.required]],
      receiptLink: [this.payment?.receiptLink ?? '']
    });
    this.imagePreview.src = this.payment?.imagePath;
    if (this.viewMode) {
      this.addPaymentForm.disable();
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    const result: any = {};
    const paymentDetails = this.addPaymentForm.value;
    paymentDetails.amount *= 100;
    result.form = paymentDetails;
    result.file = this.file;
    if (this.editMode) {
      result.form.imagePath = this.file ? null : this.imagePreview.src ?? null;
    }
    this.processPayment(this.orderId, result);
  }

  public processPayment(orderId: number, postData): void {
    this.isUploading = true;
    of(true)
      .pipe(
        switchMap(() =>
          iif(
            () => this.editMode,
            this.orderService.updatePaymentManually(this.payment?.id, postData.form, postData.file),
            this.orderService.addPaymentManually(orderId, postData.form, postData.file)
          )
        ),
        takeUntil(this.destroySub)
      )
      .subscribe(
        (data: IPaymentInfoDtos) => {
          data.amount /= 100;
          this.dialogRef.close(data);
        },
        (err) => {
          console.error('error', err);
          this.isUploading = false;
        }
      );
  }

  public filesDropped(files: File): void {
    this.file = files[0].file;
    this.isWarning = this.showWarning(this.file);
    if (!this.isWarning) {
      this.loadImage();
    }
  }

  private showWarning(file: File): boolean {
    this.isFileSizeWarning = file.size > this.maxImageSize;
    this.isFileTypeWarning = file.type !== 'image/jpeg' && file.type !== 'image/png';
    return this.isFileSizeWarning || this.isFileTypeWarning;
  }

  onFileSelect(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files.length > 0 && !this.showWarning(files[0])) {
      this.file = files[0];
      this.loadImage();
    }
  }

  loadImage() {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imagePreview.name = this.file.name;
      this.imagePreview.src = reader.result;
      if (this.editMode) {
        this.isInitialImageChanged = true;
      }
    };
  }

  removeImage() {
    this.imagePreview.name = null;
    this.imagePreview.src = null;
    this.file = null;
    if (this.editMode) {
      this.isInitialImageChanged = this.payment.imagePath !== this.imagePreview.src;
    }
  }

  editPayment() {
    this.editMode = true;
    this.addPaymentForm.enable();
    this.addPaymentForm.markAsTouched();
    this.addPaymentForm.valueChanges.pipe(takeUntil(this.destroySub)).subscribe((values) => {
      this.isInitialDataChanged =
        this.payment.settlementdate !== values.paymentDate ||
        this.payment.amount !== +values.amount ||
        (this.payment.receiptLink ?? '') !== values.receiptLink ||
        this.payment.paymentId !== values.paymentId;
    });
  }

  deletePayment() {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.deleteDialogData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.isDeleting = true;
          this.orderService
            .deleteManualPayment(this.payment.id)
            .pipe(takeUntil(this.destroySub))
            .subscribe(
              () => {
                this.dialogRef.close(this.payment.id);
              },
              () => {
                this.isDeleting = false;
              }
            );
        }
      });
  }
}
