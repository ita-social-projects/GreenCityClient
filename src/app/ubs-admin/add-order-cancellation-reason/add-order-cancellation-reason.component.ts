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
  public reason: string;
  reasonList: any[] = [
    {
      value: 'broughtHimself',
      title: 'Привезено на станцію самостійно'
    },
    {
      value: 'moving',
      title: 'Переїзд'
    },
    {
      value: 'departureFromCity',
      title: 'Виїзд з міста'
    },
    {
      value: 'didNotLikeServise',
      title: 'Не сподобався сервіс'
    },
    {
      value: 'ownOption',
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
      selected: this.reason,
      additionalInfo: ''
    };
    this.dialogRef.close(res);
  }
}
