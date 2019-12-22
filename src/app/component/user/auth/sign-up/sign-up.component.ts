import { Component, OnInit } from '@angular/core';
import { UserOwnSignUp } from '../../../../model/user-own-sign-up';
import { UserOwnSignUpService } from '../../../../service/auth/user-own-sign-up.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  userOwnSignUp: UserOwnSignUp;
  firstNameErrorMessageBackEnd: string;
  lastNameErrorMessageBackEnd: string;
  emailErrorMessageBackEnd: string;
  passwordErrorMessageBackEnd: string;
  passwordConfirmErrorMessageBackEnd: string;
  loadingAnim = false;
  tmp = true;

  constructor(
    private userOwnSecurityService: UserOwnSignUpService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userOwnSignUp = new UserOwnSignUp();
    this.setNullAllMessage();
  }


  private register(userOwnRegister: UserOwnSignUp) {
    this.setNullAllMessage();
    this.loadingAnim = true;
    this.userOwnSecurityService.signUp(userOwnRegister).subscribe(
      () => {
        this.loadingAnim = false;
        this.router.navigateByUrl('/auth/submit-email').then(r => r);
      },
      (errors: HttpErrorResponse) => {
        errors.error.forEach(error => {
          if (error.name === 'firstName') {
            this.firstNameErrorMessageBackEnd = error.message;
          } else if (error.name === 'lastName') {
            this.lastNameErrorMessageBackEnd = error.message;
          } else if (error.name === 'email') {
            this.emailErrorMessageBackEnd = error.message;
          } else if (error.name === 'password') {
            this.passwordErrorMessageBackEnd = error.message;
          } else if (error.name === 'passwordConfirm') { //  for attribut name = 'password-confirm'
            this.passwordConfirmErrorMessageBackEnd = error.message;
          }
        });
        this.loadingAnim = false;
      }
    );
  }

  private setNullAllMessage() {
    this.firstNameErrorMessageBackEnd = null;
    this.lastNameErrorMessageBackEnd = null;
    this.emailErrorMessageBackEnd = null;
    this.passwordErrorMessageBackEnd = null;
    this.passwordConfirmErrorMessageBackEnd = null;
  }

  clickImg(elememtIdInput, image) {

    const showEye = 'url(\'/assets/img/icon/eye.png\')';
    const hideEye = 'url(\'/assets/img/icon/eye-show.png\')';

    const passwordField = document.getElementById('password');
    const imgEye = document.querySelector('.img');
    if (passwordField.type === 'password') {
      imgEye.style.backgroundImage = hideEye;
      passwordField.setAttribute('type', 'text');
    } else {
      imgEye.style.backgroundImage = showEye;
      passwordField.setAttribute('type', 'password');
    }
  }

  clickImgConfirm() {
    const showEyeConfirm = 'url(\'/assets/img/icon/eye.png\')';
    const hideEyeConfirm = 'url(\'/assets/img/icon/eye-show.png\')';
    const confirmField = document.getElementById('password-confirm');
    const imgEyeConfirm = document.querySelector('.img-confirm');
    if (confirmField.type === 'password') {
      imgEyeConfirm.style.backgroundImage = hideEyeConfirm;
      confirmField.setAttribute('type', 'text');
    } else {
      imgEyeConfirm.style.backgroundImage = showEyeConfirm;
      confirmField.setAttribute('type', 'password');
    }

  }

  matchPassword() {
    let password = document.querySelector('#password').value;
    let confirmPassword = document.querySelector('#password-confirm').value;
    if (password !== confirmPassword) {
      console.log('false');
      document.querySelector('.seterror').style.display = 'block';
      document.querySelector('#password-confirm').style.border = '1px solid #F03127';
    } else {
      console.log('true');
      document.querySelector('.seterror').style.display = 'none';
      document.querySelector('#password-confirm').style.border = '1px solid #839c94';
      return null
    }
  }
}
