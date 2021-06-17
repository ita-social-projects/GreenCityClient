import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnInit {
  clientInfoForm: FormGroup;
  violations: number = 1;
  currentViolationAmount: number = 0;
  log() {
    console.log(this.clientInfoForm);
  }

  ngOnInit(): void {
    this.clientInfoForm = new FormGroup({
      clientName: new FormControl('', [Validators.required]),
      clientPhone: new FormControl('', [Validators.required]),
      clientEmail: new FormControl('', [Validators.required, Validators.email]),
      recipientName: new FormControl('', [Validators.required]),
      recipientPhone: new FormControl('', [Validators.required]),
      recipientEmail: new FormControl('', [Validators.required, Validators.email]),
    });
  }
}
