import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { AddViolationsComponent } from '../add-violations/add-violations.component';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnInit, OnDestroy {
  @Input() order;
  @Input() clientInfoForm: FormGroup;

  public userViolationForCurrentOrder: number = 0;
  public currentLanguage: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private localStorageService: LocalStorageService, private dialog: MatDialog) {}

  public initForm(): void {
    // this.customerInfoForm = new FormGroup({
    //   customerName: new FormControl('', [Validators.required]),
    //   customerPhoneNumber: new FormControl('', [Validators.required]),
    //   customerEmail: new FormControl('', [Validators.required, Validators.email]),
    //   recipientName: new FormControl('', [Validators.required]),
    //   recipientPhoneNumber: new FormControl('', [Validators.required]),
    //   recipientEmail: new FormControl('', [Validators.required, Validators.email])
    // });
  }

  ngOnInit(): void {
    // this.initForm();
    // this.getUserInfo();
    console.log(this.order);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal(): void {
    this.dialog.open(AddViolationsComponent, { height: '90%', maxWidth: '560px' });
  }
}
