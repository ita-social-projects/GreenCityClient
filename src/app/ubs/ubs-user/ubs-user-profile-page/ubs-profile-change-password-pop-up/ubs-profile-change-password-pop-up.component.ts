import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UpdatePasswordDto } from '@global-models/updatePasswordDto';
import { ChangePasswordService } from '@global-service/auth/change-password.service';
import { iif, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-ubs-profile-change-password-pop-up',
  templateUrl: './ubs-profile-change-password-pop-up.component.html',
  styleUrls: ['./ubs-profile-change-password-pop-up.component.scss']
})
export class UbsProfileChangePasswordPopUpComponent implements OnInit {
  public formConfig: FormGroup;
  private readonly passRegexp = Patterns.regexpPass;
  public updatePasswordDto: UpdatePasswordDto;
  public hasPassword: boolean;
  public hideShowPasswordImage = SignInIcons;

  constructor(
    private changePasswordService: ChangePasswordService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBarComponent
  ) {}

  ngOnInit() {
    this.hasPassword = this.data.hasPassword;
    this.initForm();
    this.updatePasswordDto = new UpdatePasswordDto();
  }

  public initForm(): void {
    this.formConfig = this.hasPassword
      ? this.fb.group(
          {
            password: ['', [Validators.required, Validators.pattern(this.passRegexp)]],
            currentPassword: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
          },
          { validators: [this.checkConfirmPassword, this.checkNewPassword] }
        )
      : this.fb.group(
          {
            password: ['', [Validators.required, Validators.pattern(this.passRegexp)]],
            confirmPassword: ['', [Validators.required]]
          },
          { validators: [this.checkConfirmPassword] }
        );
  }

  checkConfirmPassword(group: FormGroup) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { notSame: true };
  }

  checkNewPassword(group: FormGroup) {
    const password = group.get('password').value;
    const currentPassword = group.get('currentPassword').value;
    return password !== currentPassword ? null : { same: true };
  }

  public onSubmit(): void {
    this.updatePasswordDto.confirmPassword = this.formConfig.value.confirmPassword;
    this.updatePasswordDto.password = this.formConfig.value.password;
    this.updatePasswordDto.currentPassword = this.hasPassword ? this.formConfig.value.currentPassword : '';
    of(true)
      .pipe(
        mergeMap(() =>
          iif(
            () => this.hasPassword,
            this.changePasswordService.changePassword(this.updatePasswordDto),
            this.changePasswordService.setPasswordForGoogleAuth(this.updatePasswordDto)
          )
        )
      )
      .subscribe(
        (_) => this.snackBar.openSnackBar('successConfirmPasswordUbs'),
        (error) => this.snackBar.openSnackBar('ubs-client-profile.error-message')
      );
  }
}
