import { createReducer, on } from '@ngrx/store';
import { GetUserBonusesSuccess } from 'src/app/store/actions/ubs-user.actions';
import { initialUbsUserState } from 'src/app/store/state/ubs-user.state';

export const ubsUserReducer = createReducer(
  initialUbsUserState,
  on(GetUserBonusesSuccess, (state, action) => ({
    ...state,
    points: action.points
  }))
);
