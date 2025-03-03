import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Page } from '../../../models/ubs-admin.interface';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import { DialogPopUpComponent } from 'src/app/shared/components/dialog-pop-up/dialog-pop-up.component';
import { PopUpsStyles, ActionTypeForPermissions } from '../ubs-admin-employee-table/employee-models.enum';
import { GROUPS, PERMISSIONRULES, LABELS } from '@ubs/ubs-admin/models/employee-permissions.model';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-ubs-admin-employee-permissions-form',
  templateUrl: './ubs-admin-employee-permissions-form.component.html',
  styleUrls: ['./ubs-admin-employee-permissions-form.component.scss']
})
export class UbsAdminEmployeePermissionsFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  employee: Page;
  panelToggler = false;
  labels = LABELS;
  groups = GROUPS;
  permissions = PERMISSIONRULES;

  isUpdating = false;
  isDisabled = true;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private employeeService: UbsAdminEmployeeService,
    private dialogRef: MatDialogRef<UbsAdminEmployeePermissionsFormComponent>,
    private snackBar: MatSnackBarService,
    private dialog: MatDialog
  ) {
    this.employee = data;
    this.form = this.fb.group(
      Object.fromEntries(
        this.groups.map((group) => [group.name, this.fb.group(Object.fromEntries(group.permissions.map((field) => [field, false])))])
      )
    );
  }

  ngOnInit(): void {
    this.employeeService
      .getAllEmployeePermissions(this.employee.email)
      .pipe(take(1))
      .subscribe((employeePermissions: string[]) => {
        this.groups.forEach((group) => {
          group.permissions.forEach((perm) => {
            if (employeePermissions.includes(perm)) {
              this.form.get(group.name).get(perm).setValue(true);
            }
          });
        });
      });
    this.dialogRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.dialogRef.close(true));
  }

  isPanelOpen() {
    this.panelToggler = !this.panelToggler;
  }

  updateAllComplete() {
    this.isDisabled = false;
  }
  onCheckboxChange(groupName: string, perm: string): void {
    const group = this.form.get(groupName);
    const rule = this.permissions[perm];

    if (!group || !rule) {
      return;
    }

    const isChecked = !!group.get(perm)?.value;

    if (isChecked) {
      this.applyDependencies(group, rule.check, true);
    } else {
      this.applyDependencies(group, rule.uncheck, false);
    }
  }

  private applyDependencies(group: AbstractControl, dependencies: string[], value: boolean): void {
    if (!Array.isArray(dependencies) || dependencies.length === 0) {
      return;
    }

    dependencies.forEach((dependentPerm) => {
      const dependentControl = group.get(dependentPerm);
      if (dependentControl && dependentControl.value !== value) {
        dependentControl.setValue(value);
      }
    });
  }

  savePermissions() {
    this.isUpdating = true;
    const selectedPermissions = Object.entries(this.form.value)
      .flatMap(([, perm]) => Object.entries(perm))
      .filter(([, selected]) => selected)
      .map(([perm]) => perm);

    this.employeeService.updatePermissions(this.employee.email, selectedPermissions).subscribe({
      next: () => {
        this.isUpdating = false;
        this.snackBar.openSnackBar('successUpdateUbsData');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.openSnackBar('error', error);
        this.dialogRef.close(false);
      }
    });
  }

  managePermissionSettings(actionType: string): void {
    const cancelData = {
      popupTitle: 'employees.permissions.clients.cancel-changes',
      popupConfirm: 'employees.btn.yes',
      popupCancel: 'employees.btn.no',
      style: PopUpsStyles.lightGreen,
      іsPermissionConfirm: false,
      isItrefund: false
    };
    const dialogRef = this.dialog.open(DialogPopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: '',
      data: cancelData
    });

    if (actionType === ActionTypeForPermissions.cancel) {
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((confirm) => {
          if (confirm) {
            this.dialogRef.close(true);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
