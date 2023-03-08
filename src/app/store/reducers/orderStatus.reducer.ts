import { createReducer, on } from '@ngrx/store';
import { IOrderStatus } from '../state/orderStatus';
import { SetOrderStatus } from 'src/app/store/actions/orderStatus.actions';

const initialState: IOrderStatus = {
  isOrderDoneAfterBroughtHimself: false
};

export const orderStatusReducer = createReducer(
  initialState,
  on(SetOrderStatus, (state, { isOrderDoneAfterBroughtHimself }) => {
    return { ...state, isOrderDoneAfterBroughtHimself };
  })
);
