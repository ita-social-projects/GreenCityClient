import { createAction, props } from '@ngrx/store';

export const setIsOrderDoneAfterBroughtHimself = '[OrderStatus] Set IsOrderDoneAfterBroughtHimself';

export const SetOrderStatus = createAction(setIsOrderDoneAfterBroughtHimself, props<{ isOrderDoneAfterBroughtHimself: boolean }>());
