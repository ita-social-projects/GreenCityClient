import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddViolationsComponent } from '../add-violations/add-violations.component';
import { IUserInfo } from '../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnInit, OnDestroy {
  @Input() clientInfo: IUserInfo;
  @Input() clientInfoForm: FormGroup;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.pageOpen = true;
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
