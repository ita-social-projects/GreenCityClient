import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Page } from '../../../models/ubs-admin.interface';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import { DialogPopUpComponent } from 'src/app/shared/components/dialog-pop-up/dialog-pop-up.component';
import { PopUpsStyles, ActionTypeForPermissions } from '../ubs-admin-employee-table/employee-models.enum';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { IAppState } from '../../../../../store/state/app.state';
import { select, Store } from '@ngrx/store';
import { GetCategories } from '../../../../../store/actions/authority.actions';
import { IUbsAuthorityState } from '../../../../../store/state/authority.state';
import { selectAuthorityState, selectCategories } from '../../../../../store/selectors/authority.selectors';
import { LanguageService } from '../../../../../shared/i18n/language.service';

@Component({
  selector: 'app-ubs-admin-employee-permissions-form',
  templateUrl: './ubs-admin-employee-permissions-form.component.html',
  styleUrls: ['./ubs-admin-employee-permissions-form.component.scss']
})
export class UbsAdminEmployeePermissionsFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  employee: Page;
  panelToggler = false;

  isUpdating = false;
  isDisabled = true;
  authorities$: Observable<IUbsAuthorityState>;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly fb: FormBuilder,
    public readonly translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private readonly employeeService: UbsAdminEmployeeService,
    private readonly dialogRef: MatDialogRef<UbsAdminEmployeePermissionsFormComponent>,
    private readonly snackBar: MatSnackBarService,
    private readonly dialog: MatDialog,
    private readonly store: Store<IAppState>,
    readonly languageService: LanguageService
  ) {
    this.employee = data;
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.store.pipe(select(selectCategories), take(1)).subscribe((categories) => {
      if (!categories || categories.length === 0) {
        this.store.dispatch(GetCategories());
      }
    });

    combineLatest([
      this.store.pipe(
        select(selectAuthorityState),
        filter((authorities) => !!authorities.categories),
        take(1)
      ),
      this.employeeService.getAllEmployeePermissions(this.employee.email).pipe(take(1))
    ]).subscribe(([authorities, employeePermissions]) => {
      const permissions = employeePermissions as string[];

      const formGroups = authorities.categories.map((group) => [
        group.nameEn,
        this.fb.group(Object.fromEntries(group.authorities.map((perm) => [perm.name, permissions.includes(perm.name)])))
      ]);

      this.form = this.fb.group(Object.fromEntries(formGroups));
      this.authorities$ = this.store.pipe(select(selectAuthorityState));
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
