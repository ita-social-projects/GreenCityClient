import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { IOrderStatus } from '../state/orderStatus';

export const selectOrderStatus = (state: IAppState) => state.orderStatus;

export const selectIsOrderDoneAfterBroughtHimself = createSelector(
  selectOrderStatus,
  (state: IOrderStatus) => state.isOrderDoneAfterBroughtHimself
);
