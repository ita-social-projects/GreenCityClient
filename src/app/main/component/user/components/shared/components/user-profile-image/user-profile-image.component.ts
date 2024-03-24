import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile-image',
  templateUrl: './user-profile-image.component.html',
  styleUrls: ['./user-profile-image.component.scss']
})
export class UserProfileImageComponent {
  @Input() firstName: string;
  @Input() imgPath;
  @Input() isOnline;
  @Input() additionalImgClass = '';

  public getDefaultProfileImg(): string {
    let initials = '';

    if (this.firstName) {
      initials = this.firstName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    return initials;
  }
}
