import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CancellationReasonList } from '../../services/cancellation-reason-list-mock';
import { CancellationReason } from 'src/app/ubs/ubs/order-status.enum';

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
  public isHistory: boolean;
  public adminName;
  public reasonList = CancellationReasonList;
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
      cancellationComment: ['', [Validators.required, Validators.maxLength(255)]]
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
    const isCancelReasonOther = this.cancellationReason === CancellationReason.OTHER;
    const isFormUntouched = this.commentForm.untouched && !this.cancellationReason;
    const isInvalidCommentForm = this.commentForm.invalid && this.commentForm.touched && isCancelReasonOther;
    const isOtherCancellationReasonInvalid = isCancelReasonOther && !this.commentForm.get('cancellationComment').value;

    return isInvalidCommentForm || isOtherCancellationReasonInvalid || isFormUntouched;
  }
}
