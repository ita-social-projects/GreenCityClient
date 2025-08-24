import { createAction, props } from '@ngrx/store';
import { Group } from '@ubs/ubs-admin/models/employee-permissions.model';

export enum AuthorityActions {
  GetCategories = '[Authority] GetCategories',
  GetCategoriesSuccess = '[Authority] GetCategoriesSuccess',
  GetCategoriesFailure = '[Authority] GetCategoriesFailure'
}

export const GetCategories = createAction(AuthorityActions.GetCategories);

export const GetCategoriesSuccess = createAction(AuthorityActions.GetCategoriesSuccess, props<{ categories: Group[] }>());

export const GetCategoriesFailure = createAction(AuthorityActions.GetCategoriesFailure, props<{ error: any }>());
