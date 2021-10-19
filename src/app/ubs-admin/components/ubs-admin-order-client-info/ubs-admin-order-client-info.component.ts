import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddViolationsComponent } from '../add-violations/add-violations.component';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnDestroy {
  @Input() order;
  @Input() clientInfoForm: FormGroup;

  public userViolationForCurrentOrder: number = 0;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal(): void {
    this.dialog.open(AddViolationsComponent, { height: '90%', maxWidth: '560px' });
  }
}
