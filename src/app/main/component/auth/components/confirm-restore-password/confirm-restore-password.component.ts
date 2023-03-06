import { SignInIcons } from './../../../../image-pathes/sign-in-icons';
import { RestoreDto } from './../../../../model/restroreDto';
import { authImages, ubsAuthImages } from './../../../../image-pathes/auth-images';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ChangePasswordService } from '@auth-service/change-password.service';
import { ConfirmPasswordValidator, ValidatorRegExp } from '../sign-up/sign-up.validator';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { take } from 'rxjs/operators';

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
  public passwordFieldValue: string;
  public passwordConfirmFieldValue: string;
  public form: any;
  public token: string;
  public restoreDto: RestoreDto;
  public isUbs: boolean;
  public isSignInPage: boolean;

  constructor(
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBarComponent
  ) {}

  ngOnInit() {
    this.restoreDto = new RestoreDto();
    this.initFormReactive();
    this.getFormFields();
    this.setPasswordBackendErr();
    this.getToken();
    this.authImages = this.isUbs ? ubsAuthImages : authImages;
  }

  public initFormReactive(): void {
    this.confirmRestorePasswordForm = this.formBuilder.group(
      {
        password: new FormControl('', []),
        confirmPassword: new FormControl('', [])
      },
      {
        validator: [ConfirmPasswordValidator('password', 'confirmPassword'), ValidatorRegExp('password')]
      }
    );
  }

  public getFormFields(): void {
    this.passwordField = this.confirmRestorePasswordForm.get('password');
    this.confirmPasswordField = this.confirmRestorePasswordForm.get('confirmPassword');
  }

  private getToken(): void {
    this.isUbs = this.router.url.includes('/ubs/');
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
      this.token = params[`token`];
    });
  }

  public sendPasswords() {
    this.restoreDto.confirmPassword = this.confirmRestorePasswordForm.value.confirmPassword;
    this.restoreDto.password = this.confirmRestorePasswordForm.value.password;
    this.restoreDto.token = this.token;
    this.restoreDto.isUbs = this.isUbs;
    this.changePasswordService.restorePassword(this.restoreDto).subscribe(
      (data) => {
        this.form = data;
        this.router.navigate(this.isUbs ? ['ubs'] : ['']);
        this.snackBar.openSnackBar(this.isUbs ? 'successConfirmPasswordUbs' : 'successConfirmPassword');
      },
      (error) => {
        this.form = error;
        this.snackBar.openSnackBar('errorMessage', error);
      }
    );
  }

  public setPasswordBackendErr(): void {
    this.passwordErrorMessageBackEnd = null;
    if (this.confirmRestorePasswordForm) {
      this.passwordFieldValue = this.passwordField.value;
      this.passwordConfirmFieldValue = this.confirmPasswordField.value;
      this.isSignInPage = true;
    }
  }

  public setPasswordVisibility(htmlInput: HTMLInputElement, htmlImage: HTMLImageElement): void {
    htmlInput.type = htmlInput.type === 'password' ? 'text' : 'password';
    htmlImage.src = htmlInput.type === 'password' ? this.authImages.hiddenEye : this.authImages.openEye;
  }

  public closeModal(): void {
    this.router.navigate(this.isUbs ? ['ubs'] : ['']);
    this.snackBar.openSnackBar('exitConfirmRestorePassword');
  }
}
