import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-dialog-main',
  templateUrl: './confirm-dialog-main.component.html',
  styleUrls: ['./confirm-dialog-main.component.scss']
})
export class ConfirmDialogMainComponent implements OnInit {
  public title: string;
  public subtitle: string;
  public confirm: string;
  public cancel: string;

  public hasAdditionals = false;
  public name: string;
  private habitId: number;
  private userId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ConfirmDialogMainComponent>,
    private habitAssignService: HabitAssignService,
    private router: Router,
    private snackBar: MatSnackBarComponent
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.subtitle = this.data.data.subtitle;
    this.confirm = this.data.data.confirm;
    this.cancel = this.data.data.cancel;

    this.hasAdditionals = this.data.hasAdditionalData;
    if (this.hasAdditionals) {
      this.name = this.data.additionalData.name;
      this.habitId = this.data.additionalData.dataId;
      this.userId = this.data.additionalData.userId;
    }
  }

  onSubmit(): void {
    if (this.hasAdditionals) {
      this.habitAssignService
        .deleteHabitById(this.habitId)
        .pipe(take(1))
        .subscribe(() => {
          this.dialogRef.close(true);
          this.router.navigate(['profile', this.userId]);
          this.snackBar.openSnackBar('habitDeleted');
        });
    }
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
