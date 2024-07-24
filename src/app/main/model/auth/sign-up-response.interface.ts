export interface ISignUpResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  name: string;
  ownRegistration: boolean;
}
