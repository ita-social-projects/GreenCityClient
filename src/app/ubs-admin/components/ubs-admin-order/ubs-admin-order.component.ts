import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UbsAdminCancelModalComponent } from '../ubs-admin-cancel-modal/ubs-admin-cancel-modal.component';
import { UbsAdminGoBackModalComponent } from '../ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-order',
  templateUrl: './ubs-admin-order.component.html',
  styleUrls: ['./ubs-admin-order.component.scss']
})
export class UbsAdminOrderComponent implements OnInit {
  order;
  orderForm: FormGroup;

  constructor(private orderService: OrderService, private fb: FormBuilder, private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.order = this.orderService.getSelectedOrder();
    this.initForm();
  }

  initForm() {
    const address = this.order.address.split(', ');
    const personalInfo = this.order.senderName.split(' ', 2);
    this.orderForm = this.fb.group({
      orderStatusForm: this.fb.group({
        orderStatus: this.order.orderStatus,
        commentForOrder: ''
      }),
      clientInfoForm: this.fb.group({
        senderName: [personalInfo[0], [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
        senderSurname: [personalInfo[1], [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
        senderPhone: [this.order.senderPhone, [Validators.required, Validators.pattern('^\\+?3?8?(0\\d{9})$')]],
        senderEmail: [this.order.senderEmail, [Validators.required, Validators.email]]
      }),
      addressDetailsForm: this.fb.group({
        region: 'Київська',
        settlement: 'Київ',
        street: address[0] || '',
        building: address[1] || '',
        corpus: address[2] || '',
        entrance: address[3] || '',
        district: this.order.district
      }),
      exportDetailsForm: this.fb.group({
        exportedDate: this.order.dateOfExport,
        exportedTime: this.order.timeOfExport,
        receivingStation: this.order.receivingStation
      }),
      responsiblePersonsForm: this.fb.group({
        serviceManager: this.order.responsibleManager,
        callManager: this.order.responsibleCaller,
        logistician: this.order.responsibleLogicMan,
        navigator: this.order.responsibleNavigator,
        driver: this.order.responsibleDriver
      })
    });
  }

  getFormGroup(name: string): FormGroup {
    return this.orderForm.get(name) as FormGroup;
  }

  openCancelModal() {
    this.dialog
      .open(UbsAdminCancelModalComponent, {
        hasBackdrop: true
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((discarded) => {
        if (discarded) {
          this.resetForm();
        }
      });
  }

  openGoBackModal() {
    this.dialog.open(UbsAdminGoBackModalComponent, {
      hasBackdrop: true
    });
  }

  resetForm() {
    this.orderForm.reset();
    this.initForm();
  }

  onSubmit() {
    console.log(this.orderForm);
  }
}
