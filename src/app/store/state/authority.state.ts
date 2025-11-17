import { Group } from '@ubs/ubs-admin/models/employee-permissions.model';

export interface IUbsAuthorityState {
  categories: Group[] | null;
  isLoading: boolean;
  error: any;
}

export const initialCategoryState: IUbsAuthorityState = {
  categories: null,
  isLoading: false,
  error: null
};
