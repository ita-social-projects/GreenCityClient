import { SafeUrl } from '@angular/platform-browser';

export class EditProfileModel {
  city: string;
  firstName: string;
  profilePicturePath: any;
  userCredo: string;
}

export class EditProfileDto {
  city: string;
  firstName: string;
  // profilePicturePath: SafeUrl;
  userCredo: string;
}

