import { Component, Input } from '@angular/core';
import { SignInIcons } from 'src/app/image-pathes/sign-in-icons';

@Component({
  selector: 'app-google-btn',
  templateUrl: './google-btn.component.html',
  styleUrls: ['./google-btn.component.scss']
})

export class GoogleBtnComponent {
  @Input() public text: string;
  public googleImage = SignInIcons;
}
