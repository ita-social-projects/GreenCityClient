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
      paymentDate: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      paymentId: new FormControl('', [Validators.required]),
      receiptLink: new FormControl(''),
      imagePath: new FormControl('')
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const paymentDetails = this.addPaymentForm.value;
    console.log(paymentDetails);

    this.dialogRef.close(paymentDetails);
  }
}
