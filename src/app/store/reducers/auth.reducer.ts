import { createReducer, on } from '@ngrx/store';
import { SignInAction, SignInFailureAction, SignInSuccessAction } from 'src/app/store/actions/auth.actions';
import { initialAuthState } from 'src/app/store/state/auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(SignInAction, (state, action) => {
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
  })
);
