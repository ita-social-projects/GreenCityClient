import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

const authSelector = (store: IAppState) => store.auth;

export const isLoadingSelector = createSelector(authSelector, (auth) => auth.isLoading);

export const accessTokenSelector = createSelector(authSelector, (auth) => auth.accessToken);

export const userRoleSelector = createSelector(authSelector, (auth) => auth.userRole);

export const errorSelector = createSelector(authSelector, (auth) => auth.error);

export const isUBSSelector = createSelector(authSelector, (auth) => auth.isUBS);
