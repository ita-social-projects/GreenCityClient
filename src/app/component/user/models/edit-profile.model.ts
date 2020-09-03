import { SafeUrl } from '@angular/platform-browser';

export class EditProfileModel {
  city: string;
  firstName: string;
  userCredo: string;
  profilePicturePath: string;
  rating: number | null;
  showEcoPlace: boolean;
  showLocation: boolean;
  showShoppingList: boolean;
  socialNetworks: Array<string>;
}

export class EditProfileDto {
  city: string;
  firstName: string;
  userCredo: string;
  showEcoPlace: boolean;
  showLocation: boolean;
  showShoppingList: boolean;
  profilePicturePath: SafeUrl;
}

export class UserProfilePictureDto {
  id: number;
  profilePicturePath:	string;
}
