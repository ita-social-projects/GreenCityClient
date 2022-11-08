import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-order-not-taken-out-reason',
  templateUrl: './add-order-not-taken-out-reason.component.html',
  styleUrls: ['./add-order-not-taken-out-reason.component.scss']
})
export class AddOrderNotTakenOutReasonComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  date = new Date();
  public notTakenOutReason: string;
  public adminName;
  private destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(private localeStorageService: LocalStorageService, private dialogRef: MatDialogRef<AddOrderNotTakenOutReasonComponent>) {}

  ngOnInit(): void {
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.adminName = firstName;
    });
  }

  close() {
    const res = {
      action: 'cancel'
    };
    this.dialogRef.close(res);
  }

  save() {
    const res = {
      action: 'add',
      reason: this.notTakenOutReason
    };
    this.dialogRef.close(res);
  }
}
