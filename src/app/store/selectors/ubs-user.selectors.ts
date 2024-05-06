import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

export const ubsUserSelector = (store: IAppState) => store.ubsUser;

export const userBonusesSelector = createSelector(ubsUserSelector, (ubsUser) => ubsUser.points);
