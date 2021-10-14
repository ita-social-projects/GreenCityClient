import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UbsAdminCancelModalComponent } from '../ubs-admin-cancel-modal/ubs-admin-cancel-modal.component';
import { UbsAdminGoBackModalComponent } from '../ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-admin-order',
  templateUrl: './ubs-admin-order.component.html',
  styleUrls: ['./ubs-admin-order.component.scss']
})
export class UbsAdminOrderComponent implements OnInit {
  order;
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog) {
    this.order = this.router.getCurrentNavigation().extras.state.order;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const address = this.order.address.split(', ');
    this.orderForm = this.fb.group({
      orderStatusForm: this.fb.group({
        orderStatus: this.order.orderStatus,
        commentForOrder: this.order.commentsForOrder
      }),
      clientInfoForm: this.fb.group({
        senderName: this.order.senderName,
        senderPhone: this.order.senderPhone,
        senderEmail: this.order.senderEmail
      }),
      addressDetailsForm: this.fb.group({
        street: address[0] || '',
        building: address[1] || '',
        corpus: address[2] || '',
        entrance: address[3] || '',
        district: this.order.district
      })
    });
  }

  getFormGroup(name: string): FormGroup {
    return this.orderForm.get(name) as FormGroup;
  }

  openCancelModal() {
    this.dialog
      .open(UbsAdminCancelModalComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe((discarded) => {
        if (discarded) {
          this.resetForm();
        }
      });
  }

  openGoBackModal() {
    this.dialog.open(UbsAdminGoBackModalComponent);
  }

  resetForm() {
    this.orderForm.reset();
    this.initForm();
  }

  onSubmit() {
    console.log(this.orderForm.value);
  }
}
