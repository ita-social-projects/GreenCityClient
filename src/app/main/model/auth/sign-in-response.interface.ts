import { TUserRole } from '@global-models/auth/user-role.type';

export interface ISignInResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  name: string;
  ownRegistration: boolean;
  userRole: TUserRole;
}
