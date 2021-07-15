export class UserSuccessSignIn {
  userId: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface SuccessSignUpDto {
  email: string;
  ownRegistrations: boolean;
  userId: number;
  username: string;
}
