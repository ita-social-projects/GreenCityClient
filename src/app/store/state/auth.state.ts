import { TUserRole } from '@global-models/auth/user-role.type';

export interface IAuthState {
  isLoading: boolean;
  isUBS: boolean | null;
  userId: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  name: string | null;
  ownRegistration: boolean | null;
  userRole: TUserRole | null;
  error: string | null;
}

export const initialAuthState: IAuthState = {
  isLoading: false,
  isUBS: null,
  userId: null,
  accessToken: null,
  refreshToken: null,
  name: null,
  ownRegistration: null,
  userRole: null,
  error: null
};
