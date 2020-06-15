import * as UserActions from './user.actions';

export interface AppState {
  userModule: State;
}

export interface State {
  userData: {};
  habitsList: Array<any>;
  cardsList: Array<any>;
}

const initialState = {
  userData: {},
  habitsList: [],
  cardsList: [],
};

export function UserReducers(state = initialState, action: UserActions.UserActions) {
  switch (action.type) {
    case UserActions.SAVE_USER_DATA: {
      return {
        ...state,
        userData: action.payload
      };
    }

    case UserActions.SAVE_CARDS_LIST: {
      return {
        ...state,
        cardsList: action.cardsList
      };
    }

    case UserActions.SAVE_HABITS_LIST: {
      return {
        ...state,
        cardsList: action.habitsList
      };
    }

    default: {

      return {
        ...state
      };
    }
  }
}
