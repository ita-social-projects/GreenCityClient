export class EditProfileModel {
  city: string;
  name: string;
  userCredo: string;
  profilePicturePath: string;
  rating: number | null;
  showEcoPlace: boolean;
  showLocation: boolean;
  showShoppingList: boolean;
  socialNetworks: Array<{ id: number; url: string }>;
}

export class EditProfileDto {
  city: string;
  name: string;
  userCredo: string;
  showEcoPlace: boolean;
  showLocation: boolean;
  showShoppingList: boolean;
  socialNetworks: Array<string>;
}
