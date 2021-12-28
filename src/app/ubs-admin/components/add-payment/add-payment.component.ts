import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FileHandle } from '../../models/file-handle.model';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  public date = new Date();
  orderId: number;
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
    private dialogRef: MatDialogRef<AddPaymentComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.orderId = this.data;
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.adminName = firstName;
    });
    this.initForm();
  }

  initForm() {
    this.addPaymentForm = this.fb.group({
      paymentDate: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]+.[0-9][0-9]$')]],
      paymentId: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      receiptLink: ['']
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    let result: any = {};
    const paymentDetails = this.addPaymentForm.value;
    paymentDetails.amount *= 100;
    result.form = paymentDetails;
    result.file = this.file;
    this.dialogRef.close(result);
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
}
