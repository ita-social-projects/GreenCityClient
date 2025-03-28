import { ProfilePrivacyPolicy } from './edit-profile-const';

export class EditProfileModel {
  userLocationDto: UserLocationDto | null;
  name: string;
  userCredo: string;
  profilePicturePath: string;
  rating: number | null;
  showEcoPlace: ProfilePrivacyPolicy;
  showLocation: ProfilePrivacyPolicy;
  showToDoList: ProfilePrivacyPolicy;
  socialNetworks: Array<{ id: number; url: string }>;
  notificationPreferences: NotificationPreference[];
}

export class EditProfileDto {
  coordinates: Coordinates;
  name: string;
  userCredo: string;
  showEcoPlace: ProfilePrivacyPolicy;
  showLocation: ProfilePrivacyPolicy;
  showToDoList: ProfilePrivacyPolicy;
  socialNetworks: Array<string>;
  emailPreferences: NotificationPreference[];
}

export class UserLocationDto {
  id: number | null;
  cityEn: string | null;
  cityUk: string | null;
  regionEn: string | null;
  regionUk: string | null;
  countryEn: string | null;
  countryUk: string | null;
  latitude: number | null;
  longitude: number | null;
}

export class Coordinates {
  latitude?: number | null;
  longitude?: number | null;
}

export interface NotificationPreference {
  emailPreference: string;
  periodicity: string;
}
