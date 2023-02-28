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
  public name: string;
  public confirm: string;
  public cancel: string;

  private habitId: number;
  private userId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public resData,
    public dialogRef: MatDialogRef<ConfirmDialogMainComponent>,
    private habitAssignService: HabitAssignService,
    private router: Router,
    private snackBar: MatSnackBarComponent
  ) {}

  ngOnInit(): void {
    this.title = this.resData.data.title;
    this.subtitle = this.resData.data.subtitle;
    this.name = this.resData.habitName;
    this.confirm = this.resData.data.confirm;
    this.cancel = this.resData.data.cancel;
    this.habitId = this.resData.habitId;
    this.userId = this.resData.userId;
  }

  onSubmit(): void {
    this.habitAssignService
      .deleteHabitById(this.habitId)
      .pipe(take(1))
      .subscribe(() => {
        this.dialogRef.close(true);
        this.router.navigate(['profile', this.userId]);
        this.snackBar.openSnackBar('habitDeleted');
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
