import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SignInIcons } from 'src/app/image-pathes/sign-in-icons';
import { RestoreDto } from '@global-models/restroreDto';
import { ActivatedRoute } from '@angular/router';
import { ChangePasswordService } from '@auth-service/change-password.service';
import { authImages } from 'src/app/image-pathes/auth-images';
import { ConfirmPasswordValidator, ValidatorRegExp } from '../sign-up/sign-up.validator';

@Component({
  selector: 'app-confirm-restore-password',
  templateUrl: './confirm-restore-password.component.html',
  styleUrls: ['./confirm-restore-password.component.scss']
})

export class ConfirmRestorePasswordComponent implements OnInit {
  public confirmRestorePasswordForm: FormGroup;
  public passwordField: AbstractControl;
  public confirmPasswordField: AbstractControl;
  public password: FormControl;
  public confirmPassword: FormControl;
  public closeBtn = SignInIcons;
  public authImages = authImages;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  public loadingAnim: boolean;
  public form: any;
  public token: string;

  public restoreDto: RestoreDto;

  constructor(
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.getToken();
  }

  ngOnInit() {
    this.restoreDto = new RestoreDto();
    this.initFormReactive();
    this.getFormFields();
    this.setPasswordBackendErr();
    this.getToken();
  }

  public initFormReactive(): void {
    this.confirmRestorePasswordForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    },
    {
      validator: [
        ConfirmPasswordValidator('password', 'confirmPassword'),
        ValidatorRegExp('password'),
      ]
    });
  }

  public getFormFields(): void {
    this.passwordField = this.confirmRestorePasswordForm.get('password');
    this.confirmPasswordField = this.confirmRestorePasswordForm.get('confirmPassword');
  }

  public getToken() {
    this.route.queryParams.subscribe(params => {
      this.token = params[`token`];
    });
  }

  public sendPasswords() {
    this.restoreDto.confirmPassword = this.confirmRestorePasswordForm.value.confirmPassword;
    this.restoreDto.password = this.confirmRestorePasswordForm.value.password;
    this.restoreDto.token = this.token;
    this.changePasswordService.restorePassword(this.restoreDto)
      .subscribe(data => {
        this.form = data;
      }, error => {
        this.form = error;
      });
    setTimeout(() => {
      this.router.navigate(['welcome']);
    }, 2000);
  }

  private setPasswordBackendErr() {
    this.passwordErrorMessageBackEnd = null;
  }

  public setPasswordVisibility(htmlInput: HTMLInputElement, htmlImage: HTMLImageElement): void {
    htmlInput.type = htmlInput.type === 'password' ? 'text' : 'password';
    htmlImage.src = htmlInput.type === 'password' ? this.authImages.hiddenEye : this.authImages.openEye;
  }

  public closeModal( path: string ): void {
    this.router.navigate(['welcome']);
  }
}
