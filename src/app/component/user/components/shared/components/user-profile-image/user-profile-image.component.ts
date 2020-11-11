import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile-image',
  templateUrl: './user-profile-image.component.html',
  styleUrls: ['./user-profile-image.component.scss']
})
export class UserProfileImageComponent implements OnInit {
  @Input() firstName: string;
  @Input() imgPath;
  @Input() additionalImgClass = '';

  constructor() { }

  ngOnInit() {
  }

  public getDefaultProfileImg(): string {
    let initials = '';

    if (this.firstName) {
      initials = this.firstName.split(' ').map((n) => n[0]).join('').toUpperCase();
    }
    return initials;
  }
}
