import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-profile-change-password-pop-up',
  templateUrl: './ubs-profile-change-password-pop-up.component.html',
  styleUrls: ['./ubs-profile-change-password-pop-up.component.scss']
})
export class UbsProfileChangePasswordPopUpComponent implements OnInit {
  public formConfig: FormGroup;
  private readonly passRegexp = /^(?=.*[A-Za-z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?\/<>,.\]\[]+).{8,}$/;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.formConfig = this.fb.group(
      {
        password: ['', [Validators.required, Validators.pattern(this.passRegexp)]],
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
