import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { ClientProfileService } from 'src/app/ubs-admin/services/client-profile.service';

@Component({
  selector: 'app-ubs-profile-change-password-pop-up',
  templateUrl: './ubs-profile-change-password-pop-up.component.html',
  styleUrls: ['./ubs-profile-change-password-pop-up.component.scss']
})
export class UbsProfileChangePasswordPopUpComponent implements OnInit {
  public formConfig: FormGroup;
  private readonly passRegexp = /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?/<>,.\]\[]+).{8,}$/;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private clientProfileService: ClientProfileService) {}

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    if (!this.formConfig.errors) {
      this.changePassword();
    }
  }

  changePassword() {
    this.clientProfileService
      .changePassword({
        password: this.formConfig.value.password,
        currentPassword: this.formConfig.value.currentPassword,
        confirmPassword: this.formConfig.value.confirmPassword
      })
      .subscribe();
  }

  private initForm(): void {
    this.formConfig = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.passRegexp)]],
        currentPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [this.checkConfirmPassword, this.checkNewPassword] }
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
}
