import { createSelector } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';

export const ubsAdminSelector = (store: IAppState) => store.ubsAdmin;

export const adminTableOfCustomersSelector = createSelector(ubsAdminSelector, (content) => content.table);
export const isCursorWaiteSelector = createSelector(ubsAdminSelector, (content) => content.isCursorWaite);
