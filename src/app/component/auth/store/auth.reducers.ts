import * as authActions from './auth.actions';

export interface AppState {
  authModule: State;
}

export interface State {
  authStatus: boolean;
  userData: any;
}

export const initialState = {
  authStatus: false,
  userData: {}
};

export function authReducers(state = initialState, action: authActions.AuthActions) {
  switch (action.type) {
    case authActions.SIGN_IN: {
      return {
        // TO DO
        ...state
      };
    }

    case authActions.SIGN_UP: {
      return {
        // TO DO
        ...state
      };
    }

    case authActions.LOGOUT: {
      return {
        // TO DO
        ...state
      };
    }

    case authActions.SET_USER_DATA: {
      return {
        // TO DO
        ...state,
      };
    }

    default: {
      return {
        ...state
      };
    }
  }
}
