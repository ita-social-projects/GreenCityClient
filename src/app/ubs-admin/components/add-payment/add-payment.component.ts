import { Component, Inject, OnInit } from '@angular/core';
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
  public adminName;
  private destroySub: Subject<boolean> = new Subject<boolean>();
  dataSource = new MatTableDataSource();

  constructor(
    private localeStorageService: LocalStorageService,
    private dialogRef: MatDialogRef<AddPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.orderId = this.data;
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.adminName = firstName;
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close();
  }
}
