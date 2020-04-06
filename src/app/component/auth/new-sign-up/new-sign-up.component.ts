import { Component, OnInit } from '@angular/core';
import { authImages } from '../../../../assets/img/auth/auth-images';

@Component({
  selector: 'app-new-sign-up',
  templateUrl: './new-sign-up.component.html',
  styleUrls: ['./new-sign-up.component.scss']
})
export class NewSignUpComponent implements OnInit {
  private signUpImgs = authImages;

  constructor() { }

  ngOnInit() {
  }

}
