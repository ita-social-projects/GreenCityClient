import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPaymentInfoDtos } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';

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
  public date = new Date();
  orderId: number;
  viewMode: boolean;
  editMode = false;
  isDeleting = false;
  isUploading = false;
  payment: IPaymentInfoDtos | null;
  addPaymentForm: FormGroup;
  file;
  imagePreview: any = {};
  public adminName;
  isImageSizeError = false;
  isImageTypeError = false;
  dataSource = new MatTableDataSource();
  private destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(
    private localeStorageService: LocalStorageService,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
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
      paymentDate: [this.payment?.settlementdate ?? '', [Validators.required]],
      amount: [this.payment?.amount ?? '', [Validators.required, Validators.pattern('^[0-9]+$')]],
      paymentId: [this.payment?.paymentId ?? '', [Validators.required]],
      receiptLink: [this.payment?.comment ?? '']
    });
    this.imagePreview.src = this.payment?.imagePath;
    if (this.viewMode) {
      this.addPaymentForm.disable();
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const result: any = {};
    const paymentDetails = this.addPaymentForm.value;
    paymentDetails.amount *= 100;
    result.form = paymentDetails;
    result.file = this.file;
    this.processPayment(this.orderId, result);
  }

  public processPayment(orderId: number, postData): void {
    this.isUploading = true;
    this.orderService
      .addPaymentManually(orderId, postData.form, postData.file)
      .pipe(takeUntil(this.destroySub))
      .subscribe(
        (data: any) => {
          console.log(data);
          this.dialogRef.close();
        },
        () => {
          this.isUploading = false;
        }
      );
  }

  public filesDropped(files: File): void {
    this.file = files[0].file;
    this.loadImage();
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.loadImage();
    }
  }

  loadImage() {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imagePreview.name = this.file.name;
      this.imagePreview.src = reader.result;
    };
  }

  removeImage() {
    this.imagePreview.name = null;
    this.imagePreview.src = null;
    this.file = null;
  }

  editPayment() {
    this.editMode = true;
    this.addPaymentForm.enable();
  }

  deletePayment() {
    this.isDeleting = true;
  }
}
