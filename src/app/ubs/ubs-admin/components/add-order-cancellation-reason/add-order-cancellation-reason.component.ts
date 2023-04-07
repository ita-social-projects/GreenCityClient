import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

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
  public orderID: number;
  orderInfo: any;
  public isHistory: boolean;
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
    public fb: FormBuilder,
    public orderService: OrderService,
    private localeStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<AddOrderCancellationReasonComponent>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isHistory = this.data.isHistory;
    this.orderID = this.data.orderID;
    this.cancellationReason = this.data.reason;
    this.cancellationComment = this.data.comment;
  }

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
