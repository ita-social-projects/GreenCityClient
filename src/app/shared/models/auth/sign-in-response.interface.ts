import { TUserRole } from 'src/app/shared/models/auth/user-role.type';

export interface ISignInResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  name: string;
  ownRegistration: boolean;
  userRole: TUserRole;
}
