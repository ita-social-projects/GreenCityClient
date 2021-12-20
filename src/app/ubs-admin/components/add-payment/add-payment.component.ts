import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  date = new Date();
  orderId: number;
  addPaymentForm: FormGroup;
  public adminName;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  dataSource = new MatTableDataSource();

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
      paymentId: ['', [Validators.required]],
      receiptLink: [''],
      imagePath: ['']
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const paymentDetails = this.addPaymentForm.value;
    paymentDetails.paymentDate = new Date(paymentDetails.paymentDate).toISOString();
    console.log(paymentDetails);

    this.dialogRef.close(paymentDetails);
  }
}
