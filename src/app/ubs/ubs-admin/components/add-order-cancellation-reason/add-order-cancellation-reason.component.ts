import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-order-cancellation-reason',
  templateUrl: './add-order-cancellation-reason.component.html',
  styleUrls: ['./add-order-cancellation-reason.component.scss']
})
export class AddOrderCancellationReasonComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  date = new Date();
  public commentForm: FormGroup;
  public cancellationReason: string;
  public cancellationComment: string;
  public isHistory = true;
  reasonList: any[] = [
    {
      value: 'DELIVERED_HIMSELF',
      translation: 'order-cancel.reason.delivered-himself'
    },
    {
      value: 'MOVING_OUT',
      translation: 'order-cancel.reason.moving-out'
    },
    {
      value: 'OUT_OF_CITY',
      translation: 'order-cancel.reason.out-of-city'
    },
    {
      value: 'DISLIKED_SERVICE',
      translation: 'order-cancel.reason.disliked-service'
    },
    {
      value: 'OTHER',
      translation: 'order-cancel.reason.other'
    }
  ];
  public adminName;
  private destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<AddOrderCancellationReasonComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((firstName) => {
      this.adminName = firstName;
    });
  }

  public initForm(): void {
    this.commentForm = this.fb.group({
      cancellationComment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]]
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
      reason: this.cancellationReason,
      comment: this.cancellationComment
    };
    this.dialogRef.close(res);
  }

  public disableButton(): boolean {
    const isInvalidCommentForm = this.commentForm.invalid && this.commentForm.touched && this.cancellationReason === 'OTHER';
    const isOtherCancellationReasonInvalid = this.cancellationReason === 'OTHER' && !this.commentForm.get('cancellationComment').value;

    if (isInvalidCommentForm || isOtherCancellationReasonInvalid) {
      return true;
    }
    return false;
  }
}
