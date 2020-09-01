import { SafeUrl } from '@angular/platform-browser';

export class EditProfileModel {
  city: string;
  firstName: string;
  profilePicturePath: any;
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
  // profilePicturePath: SafeUrl;
  userCredo: string;
  showEcoPlace: boolean;
  showLocation: boolean;
  showShoppingList: boolean;
}

