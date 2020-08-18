
export class EditProfileModel {
  city: string;
  firstName: string;
  profilePicturePath: string;
  rating: number;
  showEcoPlace: boolean;
  showLocation: boolean;
  socialNetworks: Array<string>;
  userCredo: string;
}

export class EditProfileDto {
  city: string;
  firstName: string;
  userCredo: string;
}

