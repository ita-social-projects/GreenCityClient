import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
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

  public userViolationForCurrentOrder = 0;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  clientName: string;
  clientSurname: string;
  pageOpen: boolean;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.pageOpen = true;
    this.clientName = this.order.clientName.split(' ', 2)[0];
    this.clientSurname = this.order.clientName.split(' ', 2)[1];
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal(): void {
    this.dialog.open(AddViolationsComponent, { height: '90%', maxWidth: '560px' });
  }
}
