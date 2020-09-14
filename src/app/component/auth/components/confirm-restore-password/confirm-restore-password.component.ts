import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignInIcons } from 'src/app/image-pathes/sign-in-icons';
import { RestoreDto } from '@global-models/restroreDto';
import { ActivatedRoute } from '@angular/router';
import { ChangePasswordService } from '@auth-service/change-password.service';
import { authImages} from '../../../../image-pathes/auth-images';

@Component({
  selector: 'app-confirm-restore-password',
  templateUrl: './confirm-restore-password.component.html',
  styleUrls: ['./confirm-restore-password.component.scss']
})

export class ConfirmRestorePasswordComponent implements OnInit {
  public closeBtn = SignInIcons;
  public mainSignInImage = SignInIcons;
  public emailErrorMessageBackEnd: string;
  public passwordErrorMessageBackEnd: string;
  public loadingAnim: boolean;
  public signUpImages = authImages;
  public password: string;
  public confirmPassword: string;
  public form: any;
  public token: string;

  public restoreDto: RestoreDto;

  constructor(
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private route: ActivatedRoute
  ) {
    this.getToken();
  }

  ngOnInit() {
    this.restoreDto = new RestoreDto();
    this.setNullAllMessage();
    this.getToken();
  }

  public getToken() {
    this.route.queryParams.subscribe(params => {
      this.token = params[`token`];
    });
  }

  public sendPasswords() {
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

  private setNullAllMessage() {
    this.passwordErrorMessageBackEnd = null;
  }

  public matchPassword(passInput: HTMLInputElement,
                       passRepeat: HTMLInputElement,
                       inputBlock: HTMLElement): void {
    this.passwordErrorMessageBackEnd = null;
    inputBlock.className = passInput.value !== passRepeat.value ?
      'main-data-input-password wrong-input' :
      'main-data-input-password';
  }

  public checkSpaces(input: string): boolean {
    return input.indexOf(' ') >= 0;
  }

  public checkSymbols(input: string): boolean {
    const regexp = /^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)(?=.*[~`!@#$%^&*()+=_\-{}|:;”’?/<>,.\]\[]+).{8,}$/;
    return (regexp.test(input) || input === '');
  }

  public setPasswordVisibility(htmlInput: HTMLInputElement, htmlImage: HTMLImageElement): void {
    htmlInput.type = htmlInput.type === 'password' ? 'text' : 'password';
    htmlImage.src = htmlInput.type === 'password' ? this.signUpImages.hiddenEye : this.signUpImages.openEye;
  }

  public closeModal(): void {
    this.router.navigate(['welcome']);
  }
}
