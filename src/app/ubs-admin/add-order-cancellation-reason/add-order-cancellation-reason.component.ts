import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-order-cancellation-reason',
  templateUrl: './add-order-cancellation-reason.component.html',
  styleUrls: ['./add-order-cancellation-reason.component.scss']
})
export class AddOrderCancellationReasonComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  date = new Date();
  public cancellationReason: string;
  public cancellationComment: string;
  reasonList: any[] = [
    {
      value: 'DELIVERED_HIMSELF',
      title: 'Привезено на станцію самостійно'
    },
    {
      value: 'MOVING_OUT',
      title: 'Переїзд'
    },
    {
      value: 'OUT_OF_CITY',
      title: 'Виїзд з міста'
    },
    {
      value: 'DISLIKED_SERVICE',
      title: 'Не сподобався сервіс'
    },
    {
      value: 'OTHER',
      title: 'Свій варіант'
    }
  ];
  public name;
  private destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(private localeStorageService: LocalStorageService, private dialogRef: MatDialogRef<AddOrderCancellationReasonComponent>) {}

  ngOnInit(): void {
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  close() {
    let res = {
      action: 'cancel'
    };
    this.dialogRef.close(res);
  }

  save() {
    let res = {
      action: 'add',
      reason: this.cancellationReason,
      comment: this.cancellationComment
    };
    this.dialogRef.close(res);
  }
}
