import { createReducer, on } from '@ngrx/store';
import {
  GetCurrentUserSuccessAction,
  SignInAction,
  SignInFailureAction,
  SignInSuccessAction,
  SignInWithGoogleAction,
  SignOutAction
} from 'src/app/store/actions/auth.actions';
import { initialAuthState } from 'src/app/store/state/auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(GetCurrentUserSuccessAction, (state, action) => {
    return {
      ...state,
      ...action.data
    };
  }),
  on(SignInAction, (state, action) => {
    return {
      ...state,
      isLoading: true,
      isUBS: action.isUBS
    };
  }),
  on(SignInWithGoogleAction, (state, action) => {
    return {
      ...state,
      isLoading: true,
      isUBS: action.isUBS
    };
  }),
  on(SignInSuccessAction, (state, action) => {
    return {
      ...state,
      ...action.data,
      isLoading: false
    };
  }),
  on(SignInFailureAction, (state, action) => {
    return {
      ...state,
      isLoading: false,
      error: action.error
    };
  }),
  on(SignOutAction, () => ({
    ...initialAuthState
  }))
);
