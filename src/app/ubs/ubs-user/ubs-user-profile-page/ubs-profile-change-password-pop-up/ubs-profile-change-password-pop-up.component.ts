import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { UpdatePasswordDto } from '@global-models/updatePasswordDto';
import { ChangePasswordService } from '@global-service/auth/change-password.service';

@Component({
  selector: 'app-ubs-profile-change-password-pop-up',
  templateUrl: './ubs-profile-change-password-pop-up.component.html',
  styleUrls: ['./ubs-profile-change-password-pop-up.component.scss']
})
export class UbsProfileChangePasswordPopUpComponent implements OnInit {
  public formConfig: FormGroup;
  private readonly passRegexp = /^(?=.*[A-Za-z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?\/<>,.\]\[]+).{8,}$/;
  public updatePasswordDto: UpdatePasswordDto;
  public hasPassword: boolean;

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
    if (this.hasPassword) {
      this.updatePasswordDto.currentPassword = this.formConfig.value.currentPassword;
      this.changePasswordService.changePassword(this.updatePasswordDto).subscribe();
    } else {
      this.changePasswordService.setPasswordForGoogleAuth(this.updatePasswordDto).subscribe();
    }
    this.snackBar.openSnackBar('successConfirmPasswordUbs');
  }
}
